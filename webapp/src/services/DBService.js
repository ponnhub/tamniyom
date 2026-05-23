import { getApp } from "firebase/app"
import { getDatabase, ref, onValue, child, get } from "firebase/database";

const app = getApp()

// Get a reference to the database service
const db = getDatabase(app);
const ROOT_REF = ref(db, 'line-bot')

class DBService {

    

    getCart(customer_id) {

      return new Promise((resolve, reject) => {
        get(child(ROOT_REF, 'users/' + customer_id + '/cart')).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            resolve(snapshot.val())
            
          } else {
            console.log("No data available");
            resolve([])
          }
        }).catch((error) => {
          console.error(error);
          reject(error)
        });
      })

    }

}
export default DBService