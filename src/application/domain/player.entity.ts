export enum UPDATE_STATUS {
  TO_UPDATE,
  UPDATED,
}
export class Player {
  public readonly id: string;
  private clubId: string;
  private readonly name: string;
  private position: string;
  private readonly dateOfBirth: string;
  private age: number;
  private nationality: string[];
  private height: number;
  private foot: string;
  private joinedOn: string;
  private signedFrom: string;
  private contract: string;
  private marketValue: number;
  private status?: string;
  private isActive: boolean;
  private updateStatus: UPDATE_STATUS;

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
    this.updateStatus = [
      UPDATE_STATUS.TO_UPDATE,
      UPDATE_STATUS.UPDATED,
    ].includes(players.updateStatus as UPDATE_STATUS)
      ? (players.updateStatus as UPDATE_STATUS)
      : UPDATE_STATUS.TO_UPDATE;
  }

  public setIsActive(isActive: boolean): void {
    this.isActive = isActive;
    this.updateStatus = UPDATE_STATUS.UPDATED;
  }

  public toObject(): Record<string, unknown> {
    return {
      id: this.id,
      clubId: this.clubId,
      name: this.name,
      position: this.position,
      dateOfBirth: this.dateOfBirth,
      age: this.age,
      nationality: this.nationality,
      height: this.height,
      foot: this.foot,
      joinedOn: this.joinedOn,
      signedFrom: this.signedFrom,
      contract: this.contract,
      marketValue: this.marketValue,
      status: this.status,
      isActive: this.isActive,
      updateStatus: this.updateStatus,
    };
  }
}
