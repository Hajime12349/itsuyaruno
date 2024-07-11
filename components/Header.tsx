import SettingsButton from "@/components/SettingsButton";
import './Header.css';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="header">
            <div className="title-frame">
                <div className="title-text">
                    いつやるの?
                </div>
            </div>
            <div className="settings-button-frame">
                <SettingsButton />
            </div>
        </div>
    );
}

export default Header;