import SvgIcons from "../assets/icons/SvgIcons"
import { useNavigate } from "react-router-dom";
const BottomBar = () => {
    let navigate = useNavigate()
    const handleRoutes = (route) => {
        navigate(`/${route}`)

    }
    return(
        <div id="MainBottomBar">
            <div onClick={()=>{handleRoutes('chats')}} className="MainBottomBarOne"><SvgIcons.Chat /></div>
            <div onClick={()=>{handleRoutes('members')}} className="MainBottomBarTwo MainBottomBarOne"><SvgIcons.Members /></div>
            <div onClick={()=>{handleRoutes('frienRequests')}} className="MainBottomBarThree MainBottomBarOne"><SvgIcons.AddMember /></div>
            <div onClick={()=>{handleRoutes('profile')}} className="MainBottomBarFour MainBottomBarOne"><SvgIcons.Profile /></div>
        </div>
    )
}

export default BottomBar