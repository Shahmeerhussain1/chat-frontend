import SvgIcons from "../assets/icons/SvgIcons"

const BottomBar = () => {
    return(
        <div id="MainBottomBar">
            <div className="MainBottomBarOne"><SvgIcons.Chat /></div>
            <div className="MainBottomBarTwo MainBottomBarOne"><SvgIcons.Members /></div>
            <div className="MainBottomBarThree MainBottomBarOne"><SvgIcons.AddMember /></div>
            <div className="MainBottomBarFour MainBottomBarOne"><SvgIcons.Profile /></div>
        </div>
    )
}

export default BottomBar