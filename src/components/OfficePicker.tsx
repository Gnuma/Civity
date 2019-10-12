import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StyleProp,
  ViewStyle
} from "react-native";
import Picker, { TextInputPickerProps } from "./TextInputPicker";
import PropTypes from "prop-types";
import SolidButton from "./SolidButton";
import { Header3, Header4 } from "./Text";
import { StatusBar } from "./StatusBar";
import update from "immutability-helper";
import OutlinedInput from "./Form/OutlinedInput";
import { OfficeTypes } from "../utils/constants";
import { FlatList } from "react-native-gesture-handler";
import colors from "../styles/colors";
import Button from "./Button";
import { Subject, of, Observable, Subscription } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import {
  ___OFFICE_HINTS_ENDPOINT___,
  ___COURSE_HINTS_ENDPOINT___
} from "../store/endpoints";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Shadows from "./Shadows";
import Axios from "axios";
import {
  GeneralOffice,
  GeneralCourse,
  OfficeSerializer,
  CourseSerializer
} from "../types/ProfileTypes";

interface OfficePickerProps {
  office: OfficeSerializer;
  course: { name: string };
  year: number;
  setOffice: (office: OfficeSerializer) => void;
  setCourse: (course: { name: string }) => void;
  setYear: (year: number) => void;
  status: number;
  goBack: (keys?: any) => void;

  containerStyle: StyleProp<ViewStyle>;
}

interface OfficePickerState {
  officeOptions: OfficeSerializer[];
  courseOptions: { name: string }[];
}

export default class OfficePicker extends Component<
  OfficePickerProps,
  OfficePickerState
> {
  static propTypes = {
    office: PropTypes.any,
    course: PropTypes.any,
    year: PropTypes.any,
    setOffice: PropTypes.func,
    setCourse: PropTypes.func,
    setYear: PropTypes.func,

    status: PropTypes.number,
    goBack: PropTypes.func
  };

  officeQuery: Subject<string>;
  courseQuery: Subject<string>;
  officeQuerySubscription?: Subscription;
  courseQuerySubscription?: Subscription;

  constructor(props: OfficePickerProps) {
    super(props);

    this.officeQuery = new Subject<string>();
    this.courseQuery = new Subject<string>();

    this.state = {
      officeOptions: [],
      courseOptions: []
    };
  }

  componentDidMount() {
    this.officeQuerySubscription = createQueryObservable(
      this.officeQuery,
      "OFFICE"
    ).subscribe(this.officeQuerySubscriber);

    this.courseQuerySubscription = createQueryObservable(
      this.courseQuery,
      "COURSE"
    ).subscribe(this.courseQuerySubscriber);

    Axios.post(___OFFICE_HINTS_ENDPOINT___, { keyword: "Ao" })
      .then(console.log)
      .catch(console.log);
  }

  componentWillUnmount() {
    this.officeQuerySubscription && this.officeQuerySubscription.unsubscribe();
    this.courseQuerySubscription && this.courseQuerySubscription.unsubscribe();
  }

  changeOfficeText = (text: string) => {
    this.officeQuery.next(text);
  };

  setOffice = (office: OfficeSerializer) => {
    this.props.setOffice && this.props.setOffice(office);
  };

  changeUnCourseText = (text: string) => {
    this.courseQuery.next(text);
  };

  changeScCourseText = (text: string) => {
    this.props.setCourse && this.props.setCourse({ name: text });
  };

  setCourse = (course: { name: string }) => {
    this.props.setCourse && this.props.setCourse(course);
  };

  setYear = (index: number) => {
    this.props.setYear && this.props.setYear(index);
  };

  getContent = () => {
    const { officeOptions, courseOptions } = this.state;
    const { status, office, course, year } = this.props;

    switch (status) {
      case 0:
        return (
          <OfficeState
            value={office.name}
            options={officeOptions}
            onTextChange={this.changeOfficeText}
            onSelect={this.setOffice}
            renderOption={this.renderOfficeOption}
          />
        );
      case 1:
        return (
          <CourseState
            isUn={office.officetype == OfficeTypes.UNIVERSITY}
            value={course.name}
            options={courseOptions}
            changeUnCourseText={this.changeUnCourseText}
            changeScCourseText={this.changeScCourseText}
            renderOption={this.renderUnCourseOption}
            onSelect={this.setCourse}
          />
        );
      case 2:
        return (
          <YearState
            options={["I", "II", "III", "IV", "V"]}
            setYear={this.setYear}
            value={year}
          />
        );
    }
  };

  render() {
    const { status, office, containerStyle, goBack } = this.props;
    return (
      <View style={[{ flex: 1 }, containerStyle]}>
        <StatusBar
          status={status}
          data={[
            "Istituto o università",
            office.officetype === OfficeTypes.UNIVERSITY
              ? "Corso di laurea"
              : "Classe",
            "Anno di studi"
          ]}
          goBack={goBack}
        />
        {this.getContent()}
      </View>
    );
  }

  renderOfficeOption = (item: OfficeSerializer) => {
    return (
      <View style={{ flexDirection: "row", padding: 10, alignItems: "center" }}>
        <Icon5
          name={item.officetype == "UN" ? "graduation-cap" : "school"}
          style={{ color: colors.black }}
          size={20}
        />
        <View style={{ paddingLeft: 8 }}>
          <Header3 color={"black"} numberOfLines={1}>
            {item.name},
          </Header3>
          <Header4 color={"black"} numberOfLines={1}>
            {item.address}
          </Header4>
        </View>
      </View>
    );
  };

  renderUnCourseOption = (item: { name: string }) => {
    return (
      <Header3 color={"black"} style={{ margin: 10 }}>
        {item.name}
      </Header3>
    );
  };

  officeQuerySubscriber = {
    next: (options: OfficeSerializer[]) => {
      this.setState({ officeOptions: options });
    },
    error: (err: any) => {
      console.log(err);
      this.setState({ officeOptions: [] });
    }
  };

  courseQuerySubscriber = {
    next: (options: { name: string }[]) => {
      this.setState({ courseOptions: options });
    },
    error: (err: any) => {
      console.log(err);
      this.setState({ courseOptions: [] });
    }
  };
}

const OfficeState = ({ value, ...props }: TextInputPickerProps) => {
  return (
    <Picker
      value={value}
      {...props}
      placeholder={"Seleziona la tua università o istituto"}
    />
  );
};

interface CourseStateProps {
  //TODO
  value: string;
  changeUnCourseText: (text: string) => void;
  changeScCourseText: (text: string) => void;
  isUn: boolean;

  options: any[];
  placeholder?: string;
  onSelect: (item: any) => void;
  renderOption: (item: any) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const CourseState = ({
  value,
  changeUnCourseText,
  changeScCourseText,
  isUn,
  ...props
}: CourseStateProps) => {
  if (isUn) {
    return (
      <Picker
        value={value}
        {...props}
        placeholder="Seleziona il tuo corso"
        onTextChange={changeUnCourseText}
      />
    );
  } else {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <OutlinedInput
          value={value}
          {...props}
          placeholder="Sezione (es: A)"
          onTextChange={changeScCourseText}
          autoCapitalize="characters"
          inputStyle={{ textAlign: "center" }}
          maxLength={3}
        />
      </View>
    );
  }
};

const yearBoxSize = ((Dimensions.get("window").width - 40) / 5) * (3 / 4);

interface YearStateProps {
  value: number;
  setYear: (i: number) => void;
  options: string[];
}

const YearState = ({ value, setYear, options }: YearStateProps) => {
  return (
    <FlatList
      numColumns={5}
      columnWrapperStyle={{ flex: 1, justifyContent: "space-around" }}
      data={options}
      renderItem={({ item, index }) => {
        const year = index + 1;
        return (
          <Button
            style={{
              ...Shadows[3],
              backgroundColor: colors.white,
              width: yearBoxSize,
              height: yearBoxSize,
              borderRadius: 6,
              margin: 3,
              justifyContent: "center",
              alignItems: "center"
            }}
            onPress={() => setYear(year)}
          >
            <Header3 color="black">{item}</Header3>
            {value == year && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  borderWidth: 1,
                  borderColor: colors.secondary,
                  borderRadius: 6
                }}
              />
            )}
          </Button>
        );
      }}
      keyExtractor={(item: string) => item}
    />
  );
};

const styles = StyleSheet.create({});

const mockOfficeOptions = [
  {
    name: "UN I.I.S.S J. Von Neumann",
    address: "Via dell'uno",
    type: "university",
    id: 1
  },
  {
    name: "Liceo Scientifico Orazio",
    address: "Via dell'uno",
    type: "school",
    id: 2
  },
  {
    name: "Liceo Linguistico Nomentano",
    address: "Via dell'uno",
    type: "school",
    id: 3
  },
  {
    name: "UN Liceo Classico Nuova Sabina",
    address: "Via dell'uno",
    type: "university",
    id: 4
  },
  {
    name: "Liceo Classico Giulio Cesare",
    address: "Via dell'uno",
    type: "school",
    id: 5
  }
];

const mockUnCourseOptions = [
  {
    name: "Ingegneria Spaziale",
    id: 1
  },
  {
    name: "Lettere",
    id: 2
  }
];

const canOfficeContinue = (office: OfficeSerializer) => office.id !== undefined;
const canCourseContinue = (course: { name: string }) =>
  course.name !== undefined;
const canYearContinue = (year: number) => year !== undefined;

export const canStateContinue = ({
  office,
  status,
  year,
  course
}: {
  office: OfficeSerializer;
  status: number;
  year: number;
  course: { name: string };
}) => {
  switch (status) {
    case 0:
      return canOfficeContinue(office);
    case 1:
      return canCourseContinue(course);
    default:
      return canYearContinue(year);
  }
};

const createQueryObservable = (
  subject: Subject<string>,
  type: "OFFICE" | "COURSE"
): Observable<any> =>
  subject.pipe(
    switchMap(value =>
      ajax
        .post(
          type == "OFFICE"
            ? ___OFFICE_HINTS_ENDPOINT___
            : ___COURSE_HINTS_ENDPOINT___,
          {
            keyword: value
          }
        )
        .pipe(
          map(res => {
            console.log(res);
            return res.response;
          }),
          catchError(error => {
            console.log(error);
            return of([]);
          })
        )
    )
  );
