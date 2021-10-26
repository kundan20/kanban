import axios from 'axios';
import * as constants from '../shared/Constants'

export class CommonService {

    async getPlanet(searchVal) {
        try {
            let res = await axios({
                url: constants.BASE_URL + constants.SEARCH_PLANET_URL + `/?search=${searchVal}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                crossdomain: true
            })
            return res.data
        } catch(err) {
            console.log(err)
        }
    }

    async getPeople(searchVal) {
        try {
            let res = await axios({
                url: constants.BASE_URL + constants.SEARCH_PERSON_URL + `/?search=${searchVal}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                crossdomain: true
            })
            return res.data
        } catch(err) {
            console.log(err)
        }
    }
}