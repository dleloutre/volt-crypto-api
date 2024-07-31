import { Table, Model, Column, DataType } from 'sequelize-typescript';

enum TransactionType {
  BUY = "BUY",
  SELL = "SELL"
}

@Table({
  timestamps: false,
  tableName: 'transactions',
})

export class Transaction extends Model {
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
    type: DataType.ENUM(...Object.values(TransactionType)),
    allowNull: false,
  })
  type!: TransactionType;

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