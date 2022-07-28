import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { deleteReviewThunk, getReviewThunk } from '../../store/reviews';
import { getBusinessThunk } from '../../store/businesses'
import { getBizImagesThunk } from '../../store/images'
import ImagesGalleryModal from '../ImagesGallery';
import DeleteBusiness from '../DeleteBusiness/DeleteBusiness'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import SingleMapContainer from '../SingleMapContainer/SingleMapContainer';
import filterPic from './filterPic.png'
import fiveEmpty from '../HomePage/fiveStarsEmpty.png'
import fiveFilled from '../HomePage/fiveStarsFilled.png'

import './BusinessInfo.css'

function BusinessInfo({ businesses, categories }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { businessId } = useParams();
    const reviews = useSelector(state => state.reviewState);
    const images = useSelector(state => state.imageState);
    const imagesArr = Object.values(images);
    const singleBusiness = businesses[parseInt(businessId)];
    const currentUser = useSelector(state => state.session.user);

    const [isLoaded, setLoaded] = useState(false);
    const [users, setUsers] = useState([])

    useEffect(() => {
        dispatch(getReviewThunk(parseInt(businessId)))
            .then(() => dispatch(getBusinessThunk(parseInt(businessId))))
            .then(() => dispatch(getBizImagesThunk(parseInt(businessId))))
            .then(() => dispatch(getReviewThunk(parseInt(businessId))))
            .then(() => setLoaded(true))
    }, [businessId])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/users/');
            const responseData = await response.json();
            setUsers(responseData.users);
        }
        fetchData();
    }, []);

    const findUserName = (user_id) => {
        let result = users.filter(user => user.id == user_id);
        return result[0].username
    }

    const handleEdit = () => {
        return history.push(`/businesses/${businessId}/edit`)
    }

    const handleAddReview = () => {
        return history.push(`/businesses/${businessId}/post-review`)
    }

    const handleAddPhoto = () => {
        return history.push(`/businesses/${businessId}/image-upload`)
    }

    const handleSeePhotos = () => {
        return history.push(`/businesses/${businessId}/images`)
    }

    const getAverage = (businessId) => {
        const currentReview = Object.values(reviews).filter(review => review.business_id == businessId)
        const ratings = currentReview.map(review => review.rating)
        const averageRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length)
        return Math.floor(Number(averageRating))
    }

    const getPercentage = (businessId) => {
        let percent = (1 - getAverage(businessId) / 5).toFixed(2)
        return percent * 100
    }

    const getCategory = (id) => {
        return Object.values(categories)[id - 1]?.name
    }

    const geoloc = { latitude: singleBusiness?.latitude, longitude: singleBusiness?.longitude }

    return (
        isLoaded &&
        <div className='business-info-page'>

            <div className='all-imgs-container'>
                {imagesArr.map(({ id, image_url }) => (
                    <div key={id}>
                        <div className="image_container" style={{ backgroundImage: `url(${image_url})` }}></div>
                    </div>
                ))}
            </div>

            <div className='filter-pic' style={{ backgroundImage: `url(${filterPic})` }}></div>

            <div className='major-info'>
                <h1>{singleBusiness?.name}</h1>
                <div className='major-info-stars'>
                    <div>
                        <div className="fiveEmpty-biz">
                            <img src={fiveEmpty} />
                        </div>
                        <div className="fiveFilled-biz">
                            <img src={fiveFilled} style={{ right: `${getPercentage(singleBusiness?.id)}%` }} />
                        </div>
                    </div>
                    <p>{Object.values(reviews).length} reviews</p>
                </div>
                <div className='price-and-category'>
                    <p>☑️ <span id="blue-text">Recommended</span><span> · {singleBusiness?.price_range} ·</span> {getCategory(singleBusiness?.category_id)}</p>
                </div>
                <div className='opt-hours'>
                    <p>Operation Hours: {singleBusiness?.business_hours}</p>
                </div>
                <button id='see-photos' onClick={handleSeePhotos}>See {imagesArr.length} photos</button>
            </div>

            <div className='main-content'>
                <div className='add-review-photo'>
                    <div onClick={handleAddReview}>
                        <button id="write-a-review">
                            <i class="fa-regular fa-star fa-lg"></i> Write a review
                        </button>
                    </div>
                    <div onClick={handleAddPhoto}>
                        <button id="add-photo-button">
                            <i class="fa-solid fa-camera fa-lg"></i> Add Photo
                        </button>
                    </div>
                </div>

                {/* <div>
                    <button onClick={handleEdit}>Edit</button>
                </div>
                <div>
                    <DeleteBusiness businessId={businessId} />
                </div> */}
                <div className='location-and-hours'>
                    <h2>Location & Hours</h2>
                    <div className='location-and-hour-conatiner'>
                        <div className='location-left'>
                            <div className='left-map-container'>
                                <SingleMapContainer latitude={geoloc.latitude} longitude={geoloc.longitude} />
                            </div>
                            <p>{singleBusiness?.address}, {singleBusiness?.city}, {singleBusiness?.zip_code} </p>
                        </div>
                        <div className='location-right'>
                            <div id='weekdays'>
                                <p>Mon</p>
                                <p>Tue</p>
                                <p>Wed</p>
                                <p>Thu</p>
                                <p>Fri</p>
                                <p>Sat</p>
                                <p>Sun</p>
                            </div>
                            <div id='hours-weekday'>
                                <p>{singleBusiness?.business_hours}</p>
                                <p>{singleBusiness?.business_hours}</p>
                                <p>{singleBusiness?.business_hours}</p>
                                <p>{singleBusiness?.business_hours}</p>
                                <p>{singleBusiness?.business_hours}</p>
                                <p>{singleBusiness?.business_hours}</p>
                                <p>{singleBusiness?.business_hours}</p>
                                <div>
                                    <div id="edit-biz-button" onClick={handleEdit}>
                                        <i class="fa-solid fa-pencil"></i> Edit business info
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <p>Phone: {singleBusiness?.phone}</p>
                <p>Website: {singleBusiness?.website}</p> */}
                <h2>Recommended Reviews</h2>
                {currentUser && (
                    <div>
                        <button onClick={handleAddReview}>
                            Add Review
                        </button>
                    </div>
                )}

                {Object.values(reviews).map(({ id, content, rating, user_id }) => (
                    <div key={id}>
                        <p>{findUserName(user_id)}</p>
                        <p>{rating}</p>
                        <p>{content}</p>
                        {currentUser?.id == user_id
                            ?
                            <div>
                                <button
                                    onClick={
                                        async (e) => {
                                            e.preventDefault();
                                            await history.push(`/edit-review/${id}`);
                                        }
                                    }
                                    businessId={businessId}>
                                    Edit Review
                                </button>
                                <button
                                    onClick={
                                        async (e) => {
                                            e.preventDefault();
                                            await dispatch(deleteReviewThunk(id))
                                                .then(() => dispatch(getReviewThunk(parseInt(businessId))));
                                        }
                                    }>
                                    Delete Review
                                </button>
                            </div>
                            : <div></div>
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}



export default BusinessInfo;