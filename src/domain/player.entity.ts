export class Player {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public position: string,
    public readonly dateOfBirth: string,
    public club: string,
    public isActive: boolean,
  ) {}
}
