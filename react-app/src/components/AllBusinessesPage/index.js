import { NavLink} from 'react-router-dom';
import './AllBiz.css'
import { useDispatch, useSelector} from "react-redux";
import { useEffect } from 'react';
import { getAllBusinessesThunk } from '../../store/businesses';

const AllBusinessesPage = () => {
    // const dispatch = useDispatch()
    // const businesses = Object.values(useSelector(state => state.businesses))
    // console.log(businesses)

    // useEffect(()=>{
    //     dispatch(getAllBusinessesThunk())
    // },[dispatch])

    return (
        <div className='all-businesses-page-container'>
            <div>
                <h1>FILTER BAR放这</h1>
            </div>
            <div>
                { businesses.map(business => (
                    <NavLink 
                        to={`businesses/${business.id}`}
                        style={{ textDecoration: 'none', color: 'black' }}>
                        <div className='individual-business-listing-container'>
                            <div>
                                <img 
                                    alt='Business'
                                    className='business-listing-img-div' 
                                    src='https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80' 
                                    width="200" 
                                    height="200">
                                </img>
                            </div>
                            <div>
                                <p>{business.name}</p>
                                <p>{'这里放category'}</p>
                                <p>Open Hour : {business.business_hours}</p>
                                <p>{'这里放description还是review啊？'}{business.description}</p>
                                <hr></hr>     
                                <p>✔️ Delivery ✔️ Dine In ✔️ Take Out这个放不放都可以</p>
                            </div>
                        </div>
                    </NavLink>
                ))
                    }
            </div>
            <div>
                <h1>GOOGLE MAP 放这</h1>
            </div>
        </div>
    );
}


export default AllBusinessesPage