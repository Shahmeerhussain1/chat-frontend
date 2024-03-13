import axios from "axios";
import { useEffect, useRef, useState } from "react";
import env from "../config/config";
import SvgIcons from "../assets/icons/SvgIcons";
import BottomBar from "../components/BottomBar";
import { socket } from "../socket";
import addNotification from 'react-push-notification';

const Chats = () => {

    const [allUsers, setAllusers] = useState(null)
    const [notifications, setNotifications] = useState([])
    const [state, setState] = useState({
        mainLoader: false,
        oneSelected: null,
        InputValue: '',
    })
    const innerRef = useRef(null)
    const outerRef = useRef(null)

    let myUser = [

        // {
        //     fullName: "Shah Meer",
        //     email: "Shah@meer.com",
        //     _id: "user0",
        //     password: "meer123",
        //     profileImage: 'https://scontent.fkhi17-1.fna.fbcdn.net/v/t39.30808-6/369704562_1001637994483209_5416341007227171651_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9c7eae&_nc_ohc=lLch4w46AnkAX_iVwBx&_nc_ht=scontent.fkhi17-1.fna&oh=00_AfDCnROInRfQRlF5mZSMxUt_VUb4QDQ0vVn2jemZx0muBQ&oe=65E1E1C8'
        // },

        {
            _id:
                "user0",
            fullName:
                "John Doe",
            email:
                "john@example.com",
            password:
                "password123",
            profileImage:
                "https://scontent.fkhi17-1.fna.fbcdn.net/v/t39.30808-6/369704562_100163…"

        }

    ];

    useEffect(() => {
        socket.emit('connection', { message: 'Hello client Connected' });
        socket.on('messageSent', (data) => {
            console.log('messageSent', data)
            if (data?.receiverId == myUser[0]._id) {
                if (!allUsers) {
                    console.log('ALL USERS GONE', allUsers)
                } else {
                    handleNewMessages(data)
                }
            }
        });
        return () => {
            socket.off('connection');
            socket.off('messageSent');
        };

    }, [allUsers, state.oneSelected]);

    const handleNewMessages = (data) => {
        let toUpdateSelectedUser = state.oneSelected
        let toUpdateAllUser = allUsers
        console.log('state !', state)
        if (state.oneSelected && state.oneSelected._id == data.senderId) {
            // if (!toUpdateSelectedUser.messages.some((ele) => { return ele.timeStamp == data?.timeStamp })) {
                toUpdateSelectedUser.messages.push({ ...data })
                setState({ ...state, oneSelected: toUpdateSelectedUser })
                
            // }
            handleScroll()
        } else {
            allUsers?.map((ele, idx) => {
                if (ele._id == data.senderId) {
                    toUpdateAllUser[idx].messages.push({
                        ...data
                    })
                }
            })
            setAllusers([...toUpdateAllUser])
            let notificationsToUpdate = [...notifications];
            notificationsToUpdate.push(data.senderId)
            setNotifications([...notificationsToUpdate])
        }
        handleScroll()
        handleNotification(data?.senderId , data?.message)

    }

    useEffect(() => { handleScroll() }

        , [state.oneSelected])

    function getMessageStatus(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;

        if (diff < 60000) { // Less than 1 minute
            return 'Just now';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else { // More than 1 day
            const date = new Date(timestamp);
            const options = { month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
    }

    const onload = async () => {
        setState({ ...state, mainLoader: true })
        const apiUrl = `${env.APIURL}/getAllFriends`
        const allFriends = await axios.get(apiUrl, {
            params: {
                _id: myUser[0]._id
            }
        })
        console.log('response', allFriends)
        if (allFriends?.data?.success) {
            let usersToUpdate = [...allFriends?.data?.data?.users]
            let chatsToPush = [...allFriends?.data?.data?.chats]
            usersToUpdate?.map((ele, idx) => {
                usersToUpdate[idx].messages = chatsToPush?.filter((clc) => { return clc?.mutualIds?.includes(`${myUser[0]._id}${ele._id}`) && clc?.mutualIds?.includes(`${ele._id}${myUser[0]._id}`) })[0]?.messages
            })
            console.log('usersToUpdate', usersToUpdate)
            setAllusers([...usersToUpdate])
        }
        setState({ ...state, mainLoader: false })

    }



    useEffect(() => {
        onload()
    }, [])

    const handlePostMessage = async () => {

        if (state.InputValue) {
            const apiUrl = `${env.APIURL}/sendMessage`
            let payload = {
                senderId: myUser[0]._id,
                receiverId: state?.oneSelected?._id,
                message: state?.InputValue,
                timeStamp: new Date().valueOf()
            }
            const message = await axios.post(apiUrl, payload)

            console.log('message return', message)
            if (message.data.success) {
                if (state.oneSelected) {
                    let toUpdateOneSelected = {
                        ...state.oneSelected
                    }
                    toUpdateOneSelected.messages.push(payload)
                    setState({ ...state, InputValue: '', oneSelected: toUpdateOneSelected })

                } else {
                    setState({ ...state, InputValue: '' })
                }
            }
        }

    }

    const handleSelectOne = (ele) => {
        setState({ ...state, oneSelected: ele })
        let toUpdateNotifications = [...notifications]
        if (notifications.includes(ele._id)) {
            toUpdateNotifications = toUpdateNotifications?.filter(item => item !== ele._id)
            setNotifications([...toUpdateNotifications])
        }

    }

    useEffect(() => {
        if (state.oneSelected)
            handleScroll()
    }, [state.oneSelected])

    const handleScroll = () => {
        console.log('THEYCALLEDME')
        const outerDiv = outerRef.current;
        const innerDiv = innerRef.current;
        if (outerDiv && innerDiv) {
            outerDiv.scrollTop = innerDiv.scrollHeight - outerDiv.clientHeight + 5;
        }
    }
    function countOccurrences(array, target) {
        return array.reduce((count, value) => {
            if (value === target) {
                count++;
            }
            return count;
        }, 0);
    }
    const handleNotification = (sender , message) => {
        addNotification({
            title: 'New Message',
            subtitle: `from ${sender}`, //optional
            message: `${message}`, //optional
            // onClick: (e: Event | Notification) => void, //optional, onClick callback.
            theme: 'white', //optional, default: undefined
            duration: 6000, //optional, default: 5000,
            backgroundTop: 'green', //optional, background color of top container.
            backgroundBottom: 'darkgreen', //optional, background color of bottom container.
            colorTop: 'green', //optional, font color of top container.
            colorBottom: 'darkgreen', //optional, font color of bottom container.
            closeButton: 'Go away', //optional, text or html/jsx element for close text. Default: Close,
            native: true, //optional, makes the push notification a native OS notification
            // icon?: string, // optional, Native only. Sets an icon for the notification.
        });
    };
    return (
        <> {state.mainLoader ?
            <div className="mainLoader">
                <div className="childLoader"></div>
            </div>

            :
            <div id="chatsMain">
                {
                    state.oneSelected
                        ?
                        <div className="onSelectedinChats">
                            <div className="selectedTopName">
                                <div className="onUserinList">
                                    <div onClick={() => { setState({ ...state, oneSelected: null }) }} className="m_0 backButton">
                                        <SvgIcons.BackArrow />
                                    </div>
                                    <div className="imageDiv">
                                        <img src={state.oneSelected.profileImage} />
                                    </div>
                                    <div className="information">
                                        <div className="name">{state.oneSelected.fullName}</div>
                                        <div className="lastSeen">while ago</div>
                                    </div>
                                </div>
                            </div>

                            <div ref={outerRef} className="selectedMessages">
                                <div ref={innerRef}>
                                    {
                                        state.oneSelected &&
                                        state?.oneSelected?.messages?.map((ele, idx) => {
                                            return (
                                                <div key={idx} className={ele.receiverId == myUser[0]._id ? 'messageForMe' : 'messageForHim'}>
                                                    <span>{ele?.message} <div>{getMessageStatus(ele?.timeStamp)}</div></span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="selectedInput">
                                <textarea onChange={(e) => setState({ ...state, InputValue: e.target.value })} value={state.InputValue} placeholder="Type your message here..." />
                            </div>
                            <div onClick={() => handlePostMessage()} className="sendButton">SEND</div>


                        </div>
                        :
                        <div className="slidingMain">
                            <div className="slidingMainOne">
                                <div className="mainHeading">Chats</div>
                                {
                                    console.log('allUsers',allUsers)
                                }
                                {
                                    allUsers && allUsers?.length > 0 && allUsers.map((ele, idx) => {
                                        return (
                                            <div key={idx} className="onUserinList" onClick={() => { handleSelectOne(ele) }}>
                                                <div className="imageDiv">
                                                    <img src={ele.profileImage} />
                                                </div>
                                                <div className="information">
                                                    <div className="name">{ele.fullName}</div>
                                                    <div className="lastMessage">{allUsers && ele.messages[ele.messages.length - 1]?.message}</div>
                                                    <div className="lastMessage">{notifications.includes(ele._id) && countOccurrences(notifications, ele._id)}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="slidingMainTwo">
                                <BottomBar />
                            </div>

                        </div>
                }

            </div>
        }
        </>
    )

}

export default Chats