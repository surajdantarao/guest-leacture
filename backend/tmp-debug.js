const db=require('./models'); (async()=>{try{console.log(await db.Visitor.count());}catch(e){console.error(e);}finally{await db.sequelize.close();}})();
