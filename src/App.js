import React from "react";
import {useState, useEffect} from "react";
import './App.css';
import Post from "./Post/Post";
import {db, auth} from './firebase'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Input} from "@mui/material";
import {toast} from "react-toastify";
import ImageUpload from './ImageUpload/ImageUpload'
// import InstagramEmbed from "react-instagram-embed";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function App() {

    const [posts, setPosts] = useState([])
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser)
                setUser(authUser)
            } else {

                setUser(null)
            }
        })
        return () => {
            unsubscribe()
        }
    }, [user, username])

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })))
        })
    }, [])

    const signUp = (event) => {
        event.preventDefault();
        auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                return authUser.user.updateProfile(({
                    displayName: username
                }))
            })
            .catch((error) => toast.error(error.message))

        setOpen(false)
        setEmail('')
        setPassword('')
        setUsername('')
    }

    const signIn = (event) => {
        event.preventDefault();

        auth
            .signInWithEmailAndPassword(email, password)
            .catch((error) => toast.error(error.message))

        setOpenSignIn(false)
        setEmail('')
        setPassword('')
    }

    return (
        <div className="app">
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="app_modal">
                    <center>
                        <img
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-dark-2x.png/908edfc84eda.png"
                            alt=""/>
                    </center>
                    <form className={'app__signup'}>
                        <Input
                            className={'app_input'}
                            placeholder={'Username'}
                            type={'text'}
                            value={username}
                            defaultValue={''}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            className={'app_input'}
                            placeholder='Email'
                            defaultValue={''}
                            type={'text'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            className={'app_input'}
                            placeholder={'Password'}
                            type={'password'}
                            defaultValue={''}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type={'submit'} className={'app__submitLogin'} onClick={signUp}>Sign Up</Button>
                    </form>
                </div>
            </Modal>

            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(p => !p)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="app_modal">
                    <center>
                        <img
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-dark-2x.png/908edfc84eda.png"
                            alt=""/>
                    </center>
                    <form className={'app__signin'}>
                        <Input
                            className={'app_input'}
                            placeholder='Email'
                            defaultValue={""}
                            type={'text'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            className={'app_input'}
                            placeholder={'Password'}
                            defaultValue={''}
                            type={'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type={'submit'} className={'app__submitLogin'} onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>

            <div className="app__header">
                <img
                    className={'app__headerImage'}
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-dark-2x.png/908edfc84eda.png"
                    alt=""/>
                {
                    user ? (
                        <button onClick={() => auth.signOut()} className={'app__button'}>Log Out</button>
                    ) : (
                        <div className={'app__loginContainer'}>
                            <button onClick={() => setOpenSignIn(p => !p)} className={'app__button'}>Sign In</button>
                            <h4 className={'app_or'}> | </h4>
                            <button onClick={() => setOpen(p => !p)} className={'app__button'}>Sign Up</button>
                        </div>
                    )
                }
            </div>

            <div className="app__posts">
                {
                    posts.map(({id, post}) => (
                        <Post user={user} key={id} postId={id} username={post.username} caption={post.caption}
                              imageUrl={post.imageUrl}/>
                    ))
                }
            </div>

            {/*<InstagramEmbed*/}
            {/*    url='https://instagr.am/p/Zw9o4/'*/}
            {/*    clientAccessToken='123|456'*/}
            {/*    maxWidth={320}*/}
            {/*    hideCaption={false}*/}
            {/*    containerTagName='div'*/}
            {/*    protocol=''*/}
            {/*    injectScript*/}
            {/*    onLoading={() => {}}*/}
            {/*    onSuccess={() => {}}*/}
            {/*    onAfterRender={() => {}}*/}
            {/*    onFailure={() => {}}*/}
            {/*/>*/}

            {user?.displayName ? (
                <ImageUpload username={user.displayName}/>
            ) : (
                <code className={'app_error'}>Sorry you need to login to upload</code>
            )}
        </div>
    );
}

export default App;
