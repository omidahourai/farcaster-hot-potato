pragma solidity ^0.8.20;

import "forge-std/console.sol";

contract HotPotato {
    struct Record {
        uint256 fid;
        address user;
        uint256 highScore;
        uint256 potatoCount;
        uint256 timestamp;
    }

    struct Potato {
        uint256 receivedTimestamp;    // When the potato was received
        uint256 expirationTimestamp;  // When the potato expires (24 hours after receipt)
        uint256 senderFid;           // Farcaster ID of the sender
        address senderAddress;        // Ethereum address of the sender
        uint256 receiverFid;          // Farcaster ID of the receiver
        address receiverAddress;      // Ethereum address of the receiver
    }

    Record[] public records;
    mapping(uint256 => uint256) public userRecordIndexByFid;
    
    // Map receiver address to their active potato
    mapping(address => Potato) public potatoByReceiver;

    // Events
    event SavedScore(uint256 fid, uint256 highScore, uint256 potatoCount);
    event PassedPotato(address indexed from, address indexed to, uint256 expirationTimestamp);

    function saveScore(uint256 fid, address user, uint256 score, uint256 potatoAmount) public returns (Record memory) {
        // Check if the user already has a record
        uint256 existingIndex = userRecordIndexByFid[fid];
        uint256 currentHighScore = 0;
        uint256 currentPotatoCount = 0;
        bool userExists = false;
        
        // If the user exists, get their current highScore and potato count
        if (existingIndex > 0 || (existingIndex == 0 && records.length > 0 && records[0].fid == fid)) {
            userExists = true;
            currentHighScore = records[existingIndex].highScore;
            currentPotatoCount = records[existingIndex].potatoCount;
        }
        
        // Only update the highScore if the new score is higher
        uint256 newHighScore = score > currentHighScore ? score : currentHighScore;
        
        // Always accumulate potatoCount
        uint256 newPotatoCount = currentPotatoCount + potatoAmount;
        
        // Create a new record with the updated data
        Record memory newRecord = Record({
            fid: fid,
            user: user,
            highScore: newHighScore,
            potatoCount: newPotatoCount,
            timestamp: block.timestamp
        });
        
        if (userExists) {
            // Update the existing record
            records[existingIndex] = newRecord;
        } else {
            // Add a new record to the records array
            records.push(newRecord);
            
            // Store the index of the record in the mapping
            userRecordIndexByFid[fid] = records.length - 1;
        }
        
        // Emit the event
        emit SavedScore(fid, newHighScore, newPotatoCount);
        
        return newRecord;
    }
    
    /**
     * @notice Get a user's record by their Farcaster ID
     * @param fid The Farcaster ID of the user
     * @return The user's record containing their data
     */
    function getUserRecord(uint256 fid) public view returns (Record memory) {
        uint256 recordIndex = userRecordIndexByFid[fid];
        
        // Check if the user exists
        // Special case for index 0 (first record)
        if (recordIndex > 0 || (recordIndex == 0 && records.length > 0 && records[0].fid == fid)) {
            return records[recordIndex];
        }
        
        // If user doesn't exist, return an empty record
        return Record(0, address(0), 0, 0, 0);
    }
    
    /**
     * @notice Pass a potato from one user to another
     * @param senderFid The Farcaster ID of the sender
     * @param senderAddress The Ethereum address of the sender
     * @param receiverFid The Farcaster ID of the receiver
     * @param receiverAddress The Ethereum address of the receiver
     * @return The created Potato struct
     */
    function passPotato(
        uint256 senderFid,
        address senderAddress,
        uint256 receiverFid,
        address receiverAddress
    ) public returns (Potato memory) {
        // Calculate expiration time (24 hours from now)
        uint256 currentTime = block.timestamp;
        uint256 expirationTime = currentTime + 24 hours;
        
        // Create the new potato
        Potato memory newPotato = Potato({
            receivedTimestamp: currentTime,
            expirationTimestamp: expirationTime,
            senderFid: senderFid,
            senderAddress: senderAddress,
            receiverFid: receiverFid,
            receiverAddress: receiverAddress
        });
        
        // Store the potato in the mapping
        potatoByReceiver[receiverAddress] = newPotato;
        
        // Emit the event
        emit PassedPotato(senderAddress, receiverAddress, expirationTime);
        
        return newPotato;
    }
    
    /**
     * @notice Check if a user has an active potato
     * @param userAddress The Ethereum address of the user to check
     * @return active Whether the user has an active potato
     * @return potato The potato struct if active, otherwise an empty struct
     */
    function checkActivePotato(address userAddress) public view returns (bool active, Potato memory potato) {
        Potato memory userPotato = potatoByReceiver[userAddress];
        
        // Check if the potato exists and is not expired
        if (userPotato.receiverAddress == userAddress && block.timestamp < userPotato.expirationTimestamp) {
            return (true, userPotato);
        }
        
        // Return false and an empty potato if not active
        return (false, Potato(0, 0, 0, address(0), 0, address(0)));
    }
}
