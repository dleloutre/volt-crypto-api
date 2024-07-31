import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'wallets',
})
export class Wallet extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  balance!: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  currency_id!: number;
}
