import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'currencies',
})
export class Currency extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.ENUM('btc', 'usd'),
    allowNull: false,
    unique: true,
  })
  name!: string;
}
