export abstract class Entity {
  public id: number | undefined;

  constructor(id?: number) {
    this.id = id;
  }
}