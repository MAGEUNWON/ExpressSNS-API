// const Sequelize = require('sequelize');
const { Model, DataTypes} = require('sequelize');

module.exports = class Domain extends Model {
  static init(sequelize) {
    return super.init({
      host : {  // 인터넷 주소
        type: DataTypes.STRING(80),
        allowNull: false, //반드시 값이 존재해야 함
      },
      type: {  // 도메인 종류
        type: DataTypes.ENUM('free', 'premium'),  // ENUM 이라는 속성을 가지고 있음. 넣을 수 있는 값을 제한하는 데이터 형식. 무료(free)나 프리미엄(premium) 중에서 하나의 종류만 선택할 수 있게 함. 이를 어기면 에러 발생
        allowNull: false,
      },
      clientSecret: {  // 클라이언트 비밀 키. 다른 개발자들이 NodeBird의 API를 사용할 때 필요한 비밀키. 이 키가 유출되면 다른 사람을 사칭해서 요청을 보낼 수 있으므로 유출 되지 않도록 주의해야 함. 한 가지 안전 장치로서, 요청을 보낸 도메인까지 일치해야 요청을 보낼 수 있게 제한을 둘 것. 
        type: DataTypes.UUID, // UUID라는 타입을 가짐. UUID는 충돌 가능성이 매우 적은 랜덤한 문자열임. 
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true, // 생성일과 수정일을 자동으로 추가해주는 속성. 
      paranoid: true, // 삭제 시 실제로 데이터를 삭제하지 않고, deletedAt 속성에 삭제 일자를 기록하는 속성. 
      modelName: 'Domain', // 모델의 이름
      tableName: 'domains', // 실제 데이터 베이스에서 사용될 테이블의 이름을 지정
    });
  }

  static associate(models) { //Domaim 모델과 User 모델 간의 일대다 관계를 정의 
    this.belongsTo(models.User);
  }
};

// 도메인 모델에는 인터넷 주소(host)와 도메인 종류(type), 클라이언트 비밀 키 (clientSecret)가 들어감. 
// 사용자 모델과 일대다 관계를 가짐. 사용자 한명이 여러 도메인을 소유할 수도 있기 때문