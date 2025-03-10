export class Player {
  public constructor(
    public readonly id: string,
    public clubId: string,
    public readonly name: string,
    public position: string,
    public readonly dateOfBirth: string,
    public age: number,
    public nationality: string[],
    public height: number,
    public foot: string,
    public joinedOn: string,
    public signedFrom: string,
    public contract: string,
    public marketValue: number,
    public status: string,
    public isActive: boolean,
  ) {}
}
