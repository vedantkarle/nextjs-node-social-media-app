import { parseCookies } from 'nookies';
import React from 'react';
import baseUrl from '../utils/authUser';
import axios from axios;

const Notifications = ({ notifications, errorLoading }) => {
    
    console.log(notifications);

  return (
    <div>notifications</div>
  )
}

Notifications.getInitialProps = async (ctx) => {
    try {
        const { token } = parseCookies(ctx);

        const {data} = await axios.get(`${baseUrl}/api/notifications`,{headers:{ Authorization: token }})

        return {notifications: data}
        
    } catch (error) {
        return {errorLoading: true}
    }
}

export default Notifications