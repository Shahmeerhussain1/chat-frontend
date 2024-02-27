import axios from "axios";
import { useEffect, useState } from "react";
import env from "../config/config";
import SvgIcons from "../assets/icons/SvgIcons";

const Chats = () => {
    const [allUsers, setAllusers] = useState(null)
    const [lastMessage, setLastMessage] = useState("Kya hall hai bhai")
    const [state, setState] = useState({
        mainLoader: false,
        oneSelected: null

    })

    let myUser = [

        {
            fullName: "Shah Meer",
            email: "Shah@meer.com",
            _id: "user0",
            password: "meer123",
            profileImage: 'https://scontent.fkhi17-1.fna.fbcdn.net/v/t39.30808-6/369704562_1001637994483209_5416341007227171651_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9c7eae&_nc_ohc=lLch4w46AnkAX_iVwBx&_nc_ht=scontent.fkhi17-1.fna&oh=00_AfDCnROInRfQRlF5mZSMxUt_VUb4QDQ0vVn2jemZx0muBQ&oe=65E1E1C8'
        },

    ];

    const onload = async () => {
        setState({ ...state, mainLoader: true })
        const apiUrl = `${env.APIURL}/allUser`
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
                                    <div onClick={()=>{setState({...state , oneSelected : null})}} className="m_0 backButton">
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

                            <div className="selectedMessages"></div>
                            <div className="selectedInput">
                                <textarea placeholder="Type your message here..." />
                            </div>
                            <div className="sendButton">SEND</div>


                        </div>
                        :
                        <div className="slidingMain">
                            <div className="slidingMainOne">
                                <div className="mainHeading">Chats</div>
                                {
                                    allUsers?.length > 0 && allUsers.map((ele, idx) => {
                                        return (
                                            <div className="onUserinList" onClick={() => { setState({ ...state, oneSelected: ele }) }}>
                                                <div className="imageDiv">
                                                    <img src={ele.profileImage} />
                                                </div>
                                                <div className="information">
                                                    <div className="name">{ele.fullName}</div>
                                                    <div className="lastMessage">{lastMessage}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="slidingMainTwo">

                            </div>

                        </div>
                }

            </div>
        }
        </>
    )

}

export default Chats