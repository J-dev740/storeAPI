
const Product=require('../models/product')

const getAllProductsStatic= async (req,res)=>{
    // const search='ab'
    // const products= await Product.find({
    //     name:{$regex:search,$options:'i'},
    // })
    // const products= await Product.find({}).sort('name')
    // const products= await Product.find({}).sort('-name price') //reverse order of name increasing order of price
    //    const products= await Product.find({}).select("name price").sort('name') 
       const products= await Product.find({price:{$gt:30, $lt:50}}).select("name price").sort('price') 


    res.status(200).json({products,nbHits:products.length})
 }
 const getAllProducts= async (req,res)=>{
    // const products= await Product.find(req.query)
    // res.status(200).json({products,nbHits:products.length})
    const{featured,company,name,sort,fields,numericFilters}= req.query
    const queryObject={}
    if(featured){
        queryObject.featured=featured==='true'? true: false
    }
    if(company){
        queryObject.company=company
    }
    if(name){
        queryObject.name={$regex:name,$options:'i'}
    }
    if(numericFilters){
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',

        }
        const regEx=/\b(<|>|>=|=|<|<=)\b/g
        let filters=numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        // console.log(filters)
        const options=['price','rating'];
        filters=filters.split(',').forEach((item)=>{
            const [field,operator,value]=item.split('-')
            if(options.includes(field)){
                queryObject[field]={[operator]:Number(value)} 
            }
        })
    }
    let result= Product.find(queryObject)
    if(sort){
        const sortList=sort.split(',').join(' ')
       result=result.sort(sortList)
    }else{
        result= result.sort('createdAt')
    }
    if(fields){
        const fieldList=fields.split(',').join(' ')
       result=result.select(fieldList)
    }

    const page=Number(req.query.page)||1
    const limit= Number(req.query.limit) ||10
    const skip=(page-1)*limit
    result= result.skip(skip).limit(limit)
    console.log(queryObject)
//total 23 items
//total pages 4
// 7 7 7 2
    const products= await result
    res.status(200).json({products,nbHits:products.length})
 }

module.exports={
    getAllProducts,
    getAllProductsStatic
}