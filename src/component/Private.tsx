import {Navigate,Outlet} from 'react-router-dom'
import Cookies from 'js-cookie'


const Private = ()=>{
    const auth = Cookies.get('user');
    return(

        auth?<Outlet/>:<Navigate to="/"/>
    )
}
export default Private;