import axios from "axios";
import { useEffect, useState } from "react";
import env from "../config/config";
import SvgIcons from "../assets/icons/SvgIcons";
import BottomBar from "../components/BottomBar";

const FriendRequsts = () => {
    const [allUsers, setAllusers] = useState(null)
    const [lastMessage, setLastMessage] = useState("Kya hall hai bhai")
    const [state, setState] = useState({
        mainLoader: false,
        oneSelected: null,
        requestLoader: null
    })

    let myUser = [

        // {
        //     fullName: "Shah Meer",
        //     email: "Shah@meer.com",
        //     _id: "user0",
        //     password: "meer123",
        //     profileImage: 'https://scontent.fkhi17-1.fna.fbcdn.net/v/t39.30808-6/369704562_1001637994483209_5416341007227171651_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9c7eae&_nc_ohc=lLch4w46AnkAX_iVwBx&_nc_ht=scontent.fkhi17-1.fna&oh=00_AfDCnROInRfQRlF5mZSMxUt_VUb4QDQ0vVn2jemZx0muBQ&oe=65E1E1C8'
        // },
        {
            _id : 'user100'
        }

        // {
        //     _id:
        //         "user1",
        //     fullName:
        //         "John Doe",
        //     email:
        //         "john@example.com",
        //     password:
        //         "password123",
        //     profileImage:
        //         "https://scontent.fkhi17-1.fna.fbcdn.net/v/t39.30808-6/369704562_100163…"

        // }

    ];

    const onload = async () => {
        setState({ ...state, mainLoader: true })
        const apiUrl = `${env.APIURL}/allFriendRequests`
        console.log('apiUrl', apiUrl)

        const allFriends = await axios.get(apiUrl, {
            params: {
                _id: myUser[0]._id
            }
        })
        console.log('response', allFriends)
        if (allFriends?.data?.success) {
            setAllusers(allFriends?.data?.data)
        }
        setState({ ...state, mainLoader: false })

    }

    useEffect(() => {
        onload()
    }, [])


    const handleFriendRequest = async (ele, idx , decision) => {
        setState({ ...state, requestLoader: idx })
        const apiUrl = `${env.APIURL}/handleFriendRequest`
        const sendRequest = await axios.post(apiUrl, {
            receiverId: ele._id,
            senderId: myUser[0]._id,
            decision : decision
        })
        console.log('response', sendRequest)
        if (sendRequest?.data?.success) {
            let all = allUsers.filter((eles, idx) => { return eles._id !== ele._id })
            setAllusers(all)
        }
        setState({ ...state, requestLoader: null })
    }


    return (
        <> {state.mainLoader ?
            <div className="mainLoader">
                <div className="childLoader"></div>
            </div>

            :
            <div id="chatsMain">
                <div className="slidingMain">
                    <div className="slidingMainOne">
                        <div className="mainHeading">Friend Requests </div>
                        {
                            allUsers?.length > 0 && allUsers.map((ele, idx) => {
                                return (
                                    <div className="onUserinList no-hover" key={idx} onClick={() => { setState({ ...state, oneSelected: ele }) }}>
                                        <div className="imageDiv">
                                            <img src={ele.profileImage} />
                                        </div>
                                        <div className="information">
                                            <div className="name">{ele.fullName}</div>
                                        </div>
                                        {/* <div className="decision">
                                            <div onClick={() => { handleFriendRequest(ele, idx) }} className="sendRequest">{state.requestLoader == idx ? <div className="childLoaderRequest"></div> : "Send Request"}</div>
                                        </div> */}
                                        <div className="decision">
                                            <div className="reject"  onClick={() => { handleFriendRequest(ele, idx , 'reject') }}>
                                                <SvgIcons.Reject />
                                            </div>
                                            <div className="accept"  onClick={() => { handleFriendRequest(ele, idx , 'accept') }} >
                                                <SvgIcons.Accept />
                                            </div>
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

            </div>
        }
        </>
    )

}


export default FriendRequsts