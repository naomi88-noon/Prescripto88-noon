import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';

interface UserAttrs {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreation extends Optional<UserAttrs, 'id' | 'role'> {}

export class User extends Model<UserAttrs, UserCreation> implements UserAttrs {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'PATIENT' | 'DOCTOR' | 'ADMIN';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.STRING(50), primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(120), allowNull: false },
    role: {
      type: DataTypes.ENUM('PATIENT', 'DOCTOR', 'ADMIN'),
      allowNull: false,
      defaultValue: 'PATIENT',
    },
  },
  { sequelize, tableName: 'users' }
);
