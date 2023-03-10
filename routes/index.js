const express =require('express');
const { v4: uuidv4} = require('uuid');
const { User, Domain} = require('../models');
const {isLoggedIn} = require('./middlewares');

const router = express.Router();

router.get('/', async(req, res, next) => {
  try{
    const user = await User.findOne({
      where: {
        id : req.user?.id || null
      },
      include: {
        model: Domain
      }
    });
    res.render('login', {
      user,
      domains: user?.Domains, 
    });
  }catch(error) {
    console.error(error);
    next(error)
  }
});

router.post('/domain', isLoggedIn, async(req, res, next)=>{
  try{
    await Domain.create({
      UserId: req.user.id,
      host: req.body.host,
      type: req.body.type,
      clientSecret: uuidv4(),
    });
    res.redirect('/');
  }catch(error){
    console.error(error);
    next(error);
  }
});

module.exports = router;

// GET / 라우터와 도메인 등록 라우터(POST / domain)dla. 
// GET / 는 접속 시 로그인 화면을 보여주며, 도메인 등록 라우터는 폼으로부터 온 데이터를 도메인 모델에 저장함. 
// 도메인 등록 라우터에서는 clientSecret의 값을 uuid 패키지를 통해 생성함. uuid 중에서도 4 버전을 사용. 
// 1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed와 같은 36자리 문자열 형식으로 생김. 세 번재 마디의 첫 번째 숫자 4가 버전을 알려줌. const {v4: uuidv4} 부분이 특이한데, 패키지의 변수나 함수를 불러올 때 이름을 바꿀 수 있음. v4에서 uuidv로 바꾸었음. 
