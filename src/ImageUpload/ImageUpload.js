import React from "react";
import {useState} from "react";
import Button from '@mui/material/Button';
import {storage, db} from "../firebase";
import {toast} from "react-toastify";
import firebase from "firebase";
import './ImageUpload.css'
import {Input} from "@mui/material";

function ImageUpload({username}) {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                toast.error(error.message)
            },
            () => {
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username,
                        });
                        setProgress(0)
                        setCaption('')
                        setImage(null)
                    })
            }
        )
    }

    return (
        <div className={'imageupload'}>
            <div className="d-flex">
                <Input type="text" placeholder={'Enter a caption...'} className={'input__one'} value={caption}
                       onChange={event => setCaption(event.target.value)}/>

                <input type="file" onChange={handleChange} name="file" id="file"/>
                <label htmlFor="file">Choose a file</label>

            </div>
            <progress className={'imageupload__progress'} value={progress} max={'100'}/>

            <Button onClick={handleUpload} className={'upload_submit'}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload