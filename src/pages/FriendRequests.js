import axios from "axios";
import { useEffect, useState ,useContext} from "react";
import env from "../config/config";
import SvgIcons from "../assets/icons/SvgIcons";
import BottomBar from "../components/BottomBar";
import { UserContext } from "../components/contsxt";

const FriendRequsts = () => {
    const [allUsers, setAllusers] = useState(null)
    const { users, setUsers } = useContext(UserContext);
    const [user , setUser] = useState('')
    const [state, setState] = useState({
        mainLoader: false,
        oneSelected: null,
        requestLoader: null
    })

   

    const onload = async () => {
        let localUser
        if(users?._id ){
            localUser = users
            setUser(localUser)
        }else{
            localUser = JSON.parse(localStorage.getItem('user'))
            setUser(localUser)

        }
        setState({ ...state, mainLoader: true })
        const apiUrl = `${env.APIURL}/allFriendRequests`
        console.log('apiUrl', apiUrl)

        const allFriends = await axios.get(apiUrl, {
            params: {
                _id: localUser._id
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
            senderId: user?._id,
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