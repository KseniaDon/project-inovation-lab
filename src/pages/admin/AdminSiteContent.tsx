import { HeroData, Section, StaffMember, Command, Floor, Department, CharterDoc, Report, AbbrItem, RadioCommand, RadioRule } from "./adminTypes";
import AdminTabsSiteBasic from "./AdminTabsSiteBasic";
import AdminTabsLearning from "./AdminTabsLearning";
import AdminTabsInfrastructure from "./AdminTabsInfrastructure";

type Schedule = {
  weekdays: string; saturday: string; break: string; sunday: string; note: string;
};

interface Props {
  tab: string;
  saved: boolean;
  saving: boolean;
  saveBlock: (key: string, value: unknown) => Promise<void>;

  hero: HeroData;
  setHero: React.Dispatch<React.SetStateAction<HeroData>>;

  staff: StaffMember[];
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  editStaffIdx: number | null;
  setEditStaffIdx: React.Dispatch<React.SetStateAction<number | null>>;

  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  newItem: Record<string, string>;
  setNewItem: React.Dispatch<React.SetStateAction<Record<string, string>>>;

  commands: Command[];
  setCommands: React.Dispatch<React.SetStateAction<Command[]>>;

  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;

  floors: Floor[];
  setFloors: React.Dispatch<React.SetStateAction<Floor[]>>;

  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;

  charter: CharterDoc[];
  setCharter: React.Dispatch<React.SetStateAction<CharterDoc[]>>;

  oathLines: string[];
  setOathLines: React.Dispatch<React.SetStateAction<string[]>>;

  maleReports: Report[];
  setMaleReports: React.Dispatch<React.SetStateAction<Report[]>>;
  femaleReports: Report[];
  setFemaleReports: React.Dispatch<React.SetStateAction<Report[]>>;

  abbr: AbbrItem[];
  setAbbr: React.Dispatch<React.SetStateAction<AbbrItem[]>>;
  radioCommands: RadioCommand[];
  setRadioCommands: React.Dispatch<React.SetStateAction<RadioCommand[]>>;
  radioRules: RadioRule[];
  setRadioRules: React.Dispatch<React.SetStateAction<RadioRule[]>>;
  activityData: { ja_link: string; app_link: string; forum_link: string; afk_rules: string[] };
  setActivityData: React.Dispatch<React.SetStateAction<{ ja_link: string; app_link: string; forum_link: string; afk_rules: string[] }>>;
  introData: { welcome: string; line1: string; days_total: string; days_feldsher: string };
  setIntroData: React.Dispatch<React.SetStateAction<{ welcome: string; line1: string; days_total: string; days_feldsher: string }>>;
  internExam: { title: string; desc: string; binds_link: string; charter_link: string; exam_items: string[] };
  setInternExam: React.Dispatch<React.SetStateAction<{ title: string; desc: string; binds_link: string; charter_link: string; exam_items: string[] }>>;
}

export default function AdminSiteContent(props: Props) {
  const { tab, saved, saving, saveBlock } = props;
  return (
    <>
      <AdminTabsSiteBasic
        tab={tab} saved={saved} saving={saving} saveBlock={saveBlock}
        hero={props.hero} setHero={props.setHero}
        staff={props.staff} setStaff={props.setStaff}
        editStaffIdx={props.editStaffIdx} setEditStaffIdx={props.setEditStaffIdx}
        introData={props.introData} setIntroData={props.setIntroData}
        internExam={props.internExam} setInternExam={props.setInternExam}
      />
      <AdminTabsLearning
        tab={tab} saved={saved} saving={saving} saveBlock={saveBlock}
        sections={props.sections} setSections={props.setSections}
        newItem={props.newItem} setNewItem={props.setNewItem}
        commands={props.commands} setCommands={props.setCommands}
        maleReports={props.maleReports} setMaleReports={props.setMaleReports}
        femaleReports={props.femaleReports} setFemaleReports={props.setFemaleReports}
        abbr={props.abbr} setAbbr={props.setAbbr}
        radioCommands={props.radioCommands} setRadioCommands={props.setRadioCommands}
        radioRules={props.radioRules} setRadioRules={props.setRadioRules}
      />
      <AdminTabsInfrastructure
        tab={tab} saved={saved} saving={saving} saveBlock={saveBlock}
        schedule={props.schedule} setSchedule={props.setSchedule}
        floors={props.floors} setFloors={props.setFloors}
        departments={props.departments} setDepartments={props.setDepartments}
        charter={props.charter} setCharter={props.setCharter}
        oathLines={props.oathLines} setOathLines={props.setOathLines}
        activityData={props.activityData} setActivityData={props.setActivityData}
      />
    </>
  );
}
