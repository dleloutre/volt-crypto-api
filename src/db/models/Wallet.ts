import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'wallets',
})
export class Wallet extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  balance!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  currency_id!: number;
}
