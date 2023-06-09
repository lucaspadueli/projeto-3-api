const router = require('express').Router();

const { isAuthenticated } = require('../middlewares/jwt.middleware');
const Income = require('../models/income.model');

router.post('/', isAuthenticated, async(req,res,next)=> {
    
    const {description, value,month,year} = req.body;
    const user = req.payload._id;
    try {
        if(!value || !user){
            const error = new Error ('you have to set a Value');
            error.code = 400;
            throw error;
        }
        const newIncome = await Income.create({description, value,month,year,user});
        res.status(201).json(newIncome);
    } catch (error) {
        res.status(500).json({description: 'It was not possible to create this income'});
    }
})

router.get('/', isAuthenticated, async (req,res,next) => {
    const user = req.payload._id;
    try {
        const incomesFromDB = await Income.find({user:[user]});
        res.status(200).json(incomesFromDB);
    } catch (error) {
        res.status(500).json({description: 'Error finding the incomes', error})
    }
})

router.get('/:incomeId',isAuthenticated, async (req,res,next)=> {
    const {incomeId} = req.params;
    try {
        const oneIncome = await Income.findById(incomeId);
        res.status(200).json(oneIncome);
    } catch (error) {
        next(error)
    }
})


router.put('/:incomeId', async(req,res,next)=> {
    const {incomeId} = req.params;
    try {
        const singleIncome = await Income.findByIdAndUpdate(incomeId,req.body, {new:true});
        res.status(200).json(singleIncome);
    } catch (error) {
        next(error);
    }
})

router.delete('/:incomeId', async(req,res,next)=>{
    const {incomeId} = req.params;
    try {
        await Income.findByIdAndRemove(incomeId);
        res.status(204).json();
    } catch (error) {
        next(error);
    }
})



module.exports = router;