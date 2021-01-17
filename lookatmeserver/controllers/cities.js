const City = require('../modules/citiesModule.js')





module.exports = {
    getAllCities: async (req, res) => {
        try {
            let city = new City
            let getAllCitiesResponsed = await city.getAllCities()
            res.status(200).send({value: getAllCitiesResponsed})
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }

    },
    addCity: async (req, res) => {
        try {
            if (typeof req.body.cityName != 'undefined' && typeof req.body.point != 'undefined') {
                let city = new City
                let addCityResponsed = await city.addCity(req.body.cityName, req.body.point)
                res.status(200).send({value: addCityResponsed})
            } else {
                res.status(500).send({value: 'no city name or point sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    deleteCity: async (req, res) => {
        try {
            if (typeof req.body.cityId != 'undefined') {
                let city = new City
                let deleteCityResponsed = await city.deleteCity(req.body.cityId)
                res.status(200).send({value: deleteCityResponsed})
            } else {
                res.status(500).send({value: 'no city id sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updateCity: async (req, res) => {
        try {
            if (typeof req.body.cityName != 'undefined' && typeof req.body.cityId != 'undefined') {
                let city = new City
                let updateCityResponsed = await city.updateCity(req.body.cityName,req.body.cityId)
                res.status(200).send({value: updateCityResponsed})
            } else {
                res.status(500).send({value: 'no city id or city name sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getCityInfo: async (req, res) => {
        try {
            if (typeof req.body.cityId != 'undefined' ) {
                let city = new City
                let getCityInfoResponsed = await city.getCityInfo(req.body.cityId)
                res.status(200).send({value: getCityInfoResponsed})
            } else {
                res.status(500).send({value: 'no city id sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    }
}