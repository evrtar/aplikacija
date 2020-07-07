import firebase from 'firebase';

export const getSizeOfDatabase=(tableName:String):number=>{
    let size:number=0;
    let lastIndex:string|null='';
    firebase.database().ref(tableName+'/'+firebase.auth().currentUser?.uid).limitToLast(1).on('child_added',snap=>{
        lastIndex=snap.key;
        if(lastIndex)
            size=parseInt(lastIndex.substring(0),10)+1;
    })
    return size;
}

export const deleteElement=async(idForDelete:number,name:string):Promise<void>=>{
    await firebase.database().ref(name+firebase.auth().currentUser?.uid+'/'+idForDelete).remove();
}