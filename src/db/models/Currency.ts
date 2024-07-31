import { CurrencyName } from '@domain/currency/CurrencyName';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'currencies',
})
export class Currency extends Model {
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.ENUM(...Object.values(CurrencyName)),
    allowNull: false,
    unique: true,
  })
  name!: string;
}
