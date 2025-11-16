import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('center-content')
        
        const timer = setTimeout(() => {
            navigate('/login');
        }, 5390);
        
        return () => {
            clearTimeout(timer);
            document.body.classList.remove('center-content')
        }
    }, [navigate]);
    return (
        <>
            <h1 className="fadeGrowSpin" style={{textAlign: "center"}}>Welcome to My Website</h1>
        </>
    );
}

export default Welcome;