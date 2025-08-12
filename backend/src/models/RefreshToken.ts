import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/sequelize';
import { User } from './User';

interface RefreshTokenAttrs {
  token: string; // UUID
  userId: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  replacedByToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
interface RefreshTokenCreation
  extends Optional<RefreshTokenAttrs, 'revokedAt' | 'replacedByToken'> {}

export class RefreshToken
  extends Model<RefreshTokenAttrs, RefreshTokenCreation>
  implements RefreshTokenAttrs
{
  public token!: string;
  public userId!: string;
  public expiresAt!: Date;
  public revokedAt!: Date | null;
  public replacedByToken!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  get isExpired() {
    return this.expiresAt.getTime() < Date.now();
  }
  get isActive() {
    return !this.revokedAt && !this.isExpired;
  }
}

RefreshToken.init(
  {
    token: { type: DataTypes.STRING(64), primaryKey: true },
    userId: { type: DataTypes.STRING(50), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE, allowNull: true },
    replacedByToken: { type: DataTypes.STRING(64), allowNull: true },
  },
  { sequelize, tableName: 'refresh_tokens' }
);

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });
