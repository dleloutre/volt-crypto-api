import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'transactions',
})
export class Transaction extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  currency_id!: number;

  @Column({
    type: DataType.ENUM("buy","sell"),
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price!: number;
}
