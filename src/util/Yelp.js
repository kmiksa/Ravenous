const clientId = 'RpbKfHBD_33OqJ9_5rB_Sw';
const secret = 'jkCRvVDwSjcln6gAOPaHreJr7u6IY0wQQnLExcsKzHCsQ6mrUzsja7AdvkGs81ey';
let accessToken;
const url = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${secret}`;


const Yelp = {
 getAccessToken() {
   if (accessToken) {
     return new Promise(
       resolve => resolve(accessToken)
     );
   }
   return fetch(url, {
     method: 'POST',
   }).then(
     response => {
       if (response.ok) {
         return response.json();
       }
       console.log('Not able to get access token')
     }
   ).then(
     jsonResponse => {
       accessToken = jsonResponse.access_token;
     }
   );
 },

 search(term, location, sortBy) {
   return Yelp.getAccessToken().then(
     () => {
       const fetchUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`;
       return fetch(fetchUrl, {
         headers: {'Authorization': `Bearer ${accessToken}`}
       }).then(
         response => {
           if (response.ok) {
             return response.json();
           }
           console.log('Request failed!')
         }
       ).then(
         jsonResponse => {
           if (jsonResponse.businesses) {
             return jsonResponse.businesses.map(
               business => {
                 return {
                   id: business.id,
                   imageSrc: business.image_url,
                   name: business.name,
                   address: business.location.address1,
                   city: business.location.city,
                   state: business.location.state,
                   zipCode: business.location.zip_code,
                   category: business.categories[0].title,
                   rating: business.rating,
                   reviewCount: business.review_count,
                 };
               });
           }
           console.log('no valid answer');
         }
       );
     }
   )
 }
}

export default Yelp;
