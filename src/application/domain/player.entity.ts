export class Player {
  public readonly id: string;
  public clubId: string;
  public readonly name: string;
  public position: string;
  public readonly dateOfBirth: string;
  public age: number;
  public nationality: string[];
  public height: number;
  public foot: string;
  public joinedOn: string;
  public signedFrom: string;
  public contract: string;
  public marketValue: number;
  public status?: string;
  public isActive: boolean;

  public constructor(players: Record<string, unknown>) {
    this.id = players.id as string;
    this.clubId = players.clubId as string;
    this.name = players.name as string;
    this.position = players.position as string;
    this.dateOfBirth = players.dateOfBirth as string;
    this.age = players.age as number;
    this.nationality = players.nationality as string[];
    this.height = players.height as number;
    this.foot = players.foot as string;
    this.joinedOn = players.joinedOn as string;
    this.signedFrom = players.signedFrom as string;
    this.contract = players.contract as string;
    this.marketValue = players.marketValue as number;
    this.status = players.status as string;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
  }
}
