import app from './app.js'
import mongodb from './db/index.js';

const PORT= process.env.PORT || 3000;

mongodb()
.then(res=>{
    app.listen(PORT,()=>{
        console.log(`app listening on port ${PORT}`);
    })
})
.catch(error=>console.log(error));