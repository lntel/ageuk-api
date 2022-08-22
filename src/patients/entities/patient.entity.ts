import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { GP } from '../../gp/entities/gp.entity';
import { Assessment } from './assessment.entity';

@Entity()
export class Patient extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  startDate: Date;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleNames: string;

  @Column()
  surname: string;

  @Column()
  telephoneNumber: string;

  @Column()
  addressLine: string;

  @Column()
  dob: Date;

  @Column({ default: 'Unknown' })
  gpFullname: string;

  @Column()
  city: string;

  @Column({ default: 'Northamptonshire' })
  county: string;

  @Column()
  postcode: string;

  @Column()
  sixWeekReview: Date;

  // TODO Does the eight week period take place 8 weeks after beginning of care?
  @Column()
  eightWeekReview: Date;

  @Column({ default: 'Weeks' })
  prognosis: string;

  @Column('text', { array: true })
  diagnoses: string[];
  
  @ManyToOne(() => GP, (gp) => gp.patients)
  @JoinTable()
  generalPractioner: GP;

  @OneToOne(() => Assessment, assessment => assessment.patient, { cascade: true })
  assessment: Assessment;
  
  @Column()
  referredBy: string;
  
  @Column()
  nokDetails: string;
  
  @Column({ nullable: true })
  firstPointOfContact: string;

  @Column('text', { array: true, default: [] })
  additionalContacts: string[];

  @BeforeInsert()
  beforeInsert() {
    this.sixWeekReview = this.generateReviewDate(6);
    this.eightWeekReview = this.generateReviewDate(8);
  }

  public generateReviewDate(weeks: number) {
    // https://stackoverflow.com/a/19691491
    const result = new Date();

    result.setDate(result.getDate() + (weeks * 7));

    return result;
  }

}
