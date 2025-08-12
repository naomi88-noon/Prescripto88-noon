import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';
import { Doctor } from './Doctor';
import { User } from './User';

interface AppointmentAttrs {
  id: string;
  doctorId: string;
  patientId: string;
  start: Date;
  end: Date;
  status: 'BOOKED' | 'CANCELLED' | 'COMPLETED';
  createdAt?: Date;
  updatedAt?: Date;
}
interface AppointmentCreation extends Optional<AppointmentAttrs, 'id' | 'status'> {}

export class Appointment
  extends Model<AppointmentAttrs, AppointmentCreation>
  implements AppointmentAttrs
{
  public id!: string;
  public doctorId!: string;
  public patientId!: string;
  public start!: Date;
  public end!: Date;
  public status!: 'BOOKED' | 'CANCELLED' | 'COMPLETED';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: { type: DataTypes.STRING(50), primaryKey: true },
    doctorId: { type: DataTypes.STRING(50), allowNull: false },
    patientId: { type: DataTypes.STRING(50), allowNull: false },
    start: { type: DataTypes.DATE, allowNull: false },
    end: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.ENUM('BOOKED', 'CANCELLED', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'BOOKED',
    },
  },
  { sequelize, tableName: 'appointments' }
);

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'patientAppointments' });
Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
