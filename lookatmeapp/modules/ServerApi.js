

module.exports = {
    addcategory: async (categoryName) => {
        let response = await fetch('http://lookatmeil.com/addcategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CategoryName: categoryName
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }


    },
    getAllCategories: async () => {

        let response = await fetch('http://lookatmeil.com/getallcategories', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }

    },
    updateCategory: async (categoryName, categoryId) => {

        let response = await fetch('http://lookatmeil.com/updatecategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryName: categoryName,
                categoryId: categoryId
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    logIn: async (userPassword, userEmail) => {
        let response = await fetch('http://lookatmeil.com/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: userPassword,
                email: userEmail
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    userType: async (userEmail) => {

        let response = await fetch('http://lookatmeil.com/usertype', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail
            })
        })
        let responseJson = await response.json()


        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    deleteCategory: async (categoryId) => {
        let response = await fetch('http://lookatmeil.com/deletecategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId: categoryId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }

    },

    getAllCities: async () => {
        let response = await fetch('http://lookatmeil.com/getallcities', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }

    },

    addDigitalBoard: async (point, cityId) => {
        let response = await fetch('http://lookatmeil.com/adddigitalboard', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                point: point,
                cityId: cityId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getAllDigitalBoards: async (cityId) => {
        let response = await fetch('http://lookatmeil.com/getalldigitalboards', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cityId: cityId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getDigitalBoardInfo: async (boardId) => {
        let response = await fetch('http://lookatmeil.com/getdigitalboardinfo', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                boardId: boardId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },


    deleteDigitalBoard: async (boardId) => {
        let response = await fetch('http://lookatmeil.com/deletedigitalboard', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                boardId: boardId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    addCity: async (cityName, point) => {
        let response = await fetch('http://lookatmeil.com/addcity', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cityName: cityName,
                point: point
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    deleteCity: async (cityId) => {
        let response = await fetch('http://lookatmeil.com/deletecity', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cityId: cityId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },

    updateCity: async (cityName, cityId) => {
        let response = await fetch('http://lookatmeil.com/updatecity', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cityName: cityName,
                cityId: cityId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getPremiumUsers: async () => {
        let response = await fetch('http://lookatmeil.com/getpremiumusers', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    updatePremium: async (userEmail) => {
        let response = await fetch('http://lookatmeil.com/updatepremium', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: userEmail
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    deleteUser: async (userEmail) => {
        let response = await fetch('http://lookatmeil.com/deleteuser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userEmail: userEmail
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    userRegistration: async (email, firstName, lastName, password, digitalBoardId) => {
        let response = await fetch('http://lookatmeil.com/userregistration', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                digitalBoardId: digitalBoardId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },



    userRankCategories: async (email) => {

        let response = await fetch('http://lookatmeil.com/getuserrankcategories', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    updateUserRankCategories: async (email, RankCategoriesArray) => {
        let response = await fetch('http://lookatmeil.com/updateuserrankcategories', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                RankCategoriesArray: RankCategoriesArray
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    addAdvertisement: async (email, categoryId, description, address, price, name, phoneNumber) => {
        let response = await fetch('http://lookatmeil.com/addadvertisement', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                categoryId: categoryId,
                description: description,
                address: address,
                price: price,
                name: name,
                phoneNumber: phoneNumber
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    addPicture: async (picture, email, advertisementId) => {

        let data = new FormData()

        let uriParts = picture.uri.split('.');
        let fileType = uriParts[uriParts.length - 1];
        data.append('photo', {
            name: `${email + '_' + advertisementId + '_' + Date.now().toString()}.${fileType}`,
            type: `image/${fileType}`,
            uri: picture.uri,
            email: email
        })



        let response = await fetch('http://lookatmeil.com/addpicture', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    addCategoryPicture: async (pictureUrl, categoryId) => {
 
        let data = new FormData()

        let uriParts = pictureUrl.split('.');
        let fileType = uriParts[uriParts.length - 1];
        data.append('photo', {
            name: `${categoryId}_${Date.now()}.${fileType}`,
            type: `image/${fileType}`,
            uri: pictureUrl,
        })



        let response = await fetch('http://lookatmeil.com/addcategorypicture', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    updateUserPicture: async (pictureUrl, userEmail) => {
 
        let data = new FormData()

        let uriParts = pictureUrl.split('.');
        let fileType = uriParts[uriParts.length - 1];
        data.append('photo', {
            name: `${userEmail}_${Date.now()}.${fileType}`,
            type: `image/${fileType}`,
            uri: pictureUrl,
        })



        let response = await fetch('http://lookatmeil.com/updateuserpicture', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: data
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getAdvertisementsForUser: async (email) => {
        let response = await fetch('http://lookatmeil.com/getadvertisementsforuser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    removePicture: async (pictureUrl) => {
        let response = await fetch('http://lookatmeil.com/removepicture', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pictureUrl: pictureUrl
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getPicturesForAdvertisement: async (email, categoryId) => {
        let response = await fetch('http://lookatmeil.com/getpicturesforadvertisement', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                categoryId: categoryId,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getPictureForCategory: async (categoryId) => {
        let response = await fetch('http://lookatmeil.com/getpictureforcategory', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId: categoryId,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    updateAdvertisementDescription: async (description, advertisementId) => {
        let response = await fetch('http://lookatmeil.com/updateadvertisementdescription', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description,
                advertisementId: advertisementId,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    updateAdvertisementName: async (name, advertisementId) => {
        let response = await fetch('http://lookatmeil.com/updateadvertisementname', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                advertisementId: advertisementId,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    updateAdvertisementAddress: async (address, advertisementId) => {
        let response = await fetch('http://lookatmeil.com/updateadvertisementaddress', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                address: address,
                advertisementId: advertisementId,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    updateAdvertisementPrice: async (price, advertisementId) => {
        let response = await fetch('http://lookatmeil.com/updateadvertisementprice', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                price: price,
                advertisementId: advertisementId,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    updateAdvertisementPhoneNumber: async (phoneNumber, advertisementId) => {
        let response = await fetch('http://lookatmeil.com/updateadvertisementphonenumber', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                advertisementId: advertisementId,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    deleteAdvertisement: async (advertisementId) => {
        let response = await fetch('http://lookatmeil.com/deleteadvertisement', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertisementId: advertisementId,
            })
        })

        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    addDigitalBoardToAdvertisement: async (advertisementId, DigitalBoardsId) => {

        let response = await fetch('http://lookatmeil.com/adddigitalboardtoadvertisement', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertisementId: advertisementId,
                DigitalBoardsId: DigitalBoardsId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getDigitalBoardsForAdvertisements: async (advertisementId) => {

        let response = await fetch('http://lookatmeil.com/getdigitalboardsforadvertisements', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertisementId: advertisementId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    deleteDigitalBoardFromAdvertisement: async (advertisementId, digitalBoardId, ) => {

        let response = await fetch('http://lookatmeil.com/deletedigitalboardfromadvertisement', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertisementId: advertisementId,
                digitalBoardId: digitalBoardId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getAdvertisementsForConsumer: async (consumerEmail) => {

        let response = await fetch('http://lookatmeil.com/getadvertisementsforconsumer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                consumerEmail: consumerEmail,
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getCityInfo: async (cityId) => {

        let response = await fetch('http://lookatmeil.com/getcityinfo', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cityId: cityId,
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getAdvertisementsQuery: async (categoryId, cityId, digitalBoardId = false) => {

        let response = await fetch('http://lookatmeil.com/getadvertisementsquery', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryId: categoryId,
                cityId: cityId,
                digitalBoardId: digitalBoardId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    addAdvertisementForConsumer: async (email, advertisementsId) => {

        let response = await fetch('http://lookatmeil.com/addadvertisementforconsumer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                advertisementsId: advertisementsId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
        
            throw responseJson.value
        }
    },
    getConsumerSelectedAds: async (email) => {

        let response = await fetch('http://lookatmeil.com/getconsumerselectedads', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },

    deleteAdvertisementFormConsumer: async (email, advertisementsId) => {

        let response = await fetch('http://lookatmeil.com/deleteadvertisementformconsumer', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                advertisementsId: advertisementsId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },


    sendUserLocation: async (email, latitude, longitude) => {

        let response = await fetch('http://lookatmeil.com/senduserlocation', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                latitude: latitude,
                longitude: longitude
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    rankAdvertiser: async (advertiserEmail, consumerEmail, consumerRank) => {
        let response = await fetch('http://lookatmeil.com/rankadvertiser', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertiserEmail: advertiserEmail,
                consumerEmail: consumerEmail,
                consumerRank: consumerRank
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    checkForConsumerRank: async (advertiserEmail, consumerEmail) => {

        let response = await fetch('http://lookatmeil.com/checkforconsumerrank', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertiserEmail: advertiserEmail,
                consumerEmail: consumerEmail
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    checkForPremium: async (advertiserEmail, advertisementId) => {

        let response = await fetch('http://lookatmeil.com/checkforpremium', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertiserEmail: advertiserEmail,
                advertisementId: advertisementId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getAdViews: async (advertisementId) => {

        let response = await fetch('http://lookatmeil.com/getadviews', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                advertisementId: advertisementId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    getConsumerNearDigitalBoard: async (consumerEmail) => {

        let response = await fetch('http://lookatmeil.com/getconsumerneardigitalboard', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                consumerEmail: consumerEmail
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },
    setConsumerNearDigitalBoard: async (consumerEmail,digitalBoardId) => {

        let response = await fetch('http://lookatmeil.com/setconsumerneardigitalboard', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                consumerEmail: consumerEmail,
                digitalBoardId:digitalBoardId
            })
        })
        let responseJson = await response.json()
        if (response.status == 200) {
            return (responseJson.value)
        } else {
            throw responseJson.value
        }
    },



}
