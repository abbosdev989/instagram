import React from "react";
import './Post.css'
import {Avatar} from "@mui/material";
import {useState, useEffect} from "react";
import {db} from "../firebase";
import firebase from "firebase";

function Post({postId, imageUrl, username, caption, user}) {

    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }

        return () => {
            unsubscribe()
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault()

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className={'post'}>
            <div className="post__header">
                <Avatar className={'post__avatar'} alt='Abbos' src='/static/images/avatar/1.jpg'/>
                <h3>{username}</h3>
            </div>

            <img className={'post__image'} src={imageUrl} alt=""/>
            <h4 className={'post__text'}><b>{username} </b>{caption}</h4>

            <div className="post__comments">
                {
                    comments.map((comment) => (
                        <p>
                            <b>{comment.username} </b>
                            {comment.text}
                        </p>
                    ))
                }
            </div>

            {
                user && (
                    <form className={'post__commentBox'}>
                        <input type="text" className={'post__input'} placeholder={'Add a comment...'} value={comment}
                               onChange={(e) => setComment(e.target.value)}/>
                        <button className={'post__button'} disabled={!comment} type={'submit'} onClick={postComment}>Send...
                        </button>
                    </form>
                )
            }
        </div>
    )
}

export default Post