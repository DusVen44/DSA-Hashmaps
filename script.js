class HashMap {
    constructor(initialCapacity=8) { //constructor with propery initialCapacity value of 8
        this.length = 0; //initial length is 0
        this._hashTable = []; //has table will start as an empty array - all data will go in here
        this._capacity = initialCapacity; //capacity will grow as space is needed
        this._deleted = 0; //keep track of how much was deleted
    };

    static _hashString(string) { //hashes a string - djb2 algorithm
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            hash = (hash << 5) + hash + string.charCodeAt(i);
            hash = hash & hash;
        };
        return hash >>> 0;
    };

    set(key, value){ //add an item to the hashmap
        const loadRatio = (this.length + this._deleted + 1) / this._capacity; //find out if loadRatio is too high
        if (loadRatio > HashMap.MAX_LOAD_RATIO) { //if loadRatio is greater than MAX LOAD RATIO
            this._resize(this._capacity * HashMap.SIZE_RATIO); //add space - capacity * SIZE RATIO
        };
        
        const index = this._findSlot(key); //Find the slot where this key should be in

        if(!this._hashTable[index]){ //if there is no spot for the entry
            this.length++; //add to the length of the HashMap
        };
        this._hashTable[index] = { //insert the values in the index location 
            key,
            value,
            DELETED: false
        }; 
    };

    _findSlot(key) { //helper function to find a spot for a new key
        const hash = HashMap._hashString(key); //hashes a string with the value of (key)
        const start = hash % this._capacity; //find a slot for the key

        for (let i=start; i<start + this._capacity; i++) { //loop through the array
            const index = i % this._capacity; 
            const slot = this._hashTable[index];
            if (slot === undefined || (slot.key === key && !slot.DELETED)) {
                return index;
            };
        };
    };

    _resize(size) { //resize method - if hashmap reaches load capacity maximum
        const oldSlots = this._hashTable; //save the current data
        this._capacity = size; //change capacity to the value of (size)
        this.length = 0; // Reset the length - it will get rebuilt as you add the items back
        this._hashTable = []; //Reset the table

        for (const slot of oldSlots) { //Recreate the table - now with the larger capacity
            if (slot !== undefined) {
                this.set(slot.key, slot.value);
            };
        };
    };

    delete(key) { //won't actually delete, but will mark as deleted and adjust numbers
        const index = this._findSlot(key); //find the index searched for
        const slot = this._hashTable[index];
        if (slot === undefined) {
            throw new Error('Key error');
        };
        slot.DELETED = true; //change deleted property to true
        this.length--; //resize length
        this._deleted++; //add to deleted
    };

}