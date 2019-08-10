import React, { Component } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import Picker from "./TextInputPicker";
import PropTypes from "prop-types";
import SolidButton from "./SolidButton";
import { Header3, Header4 } from "./Text";
import { StatusBar } from "./StatusBar";
import update from "immutability-helper";
import OutlinedInput from "./Form/OutlinedInput";
import { OfficeTypes } from "../utils/constants";
import { FlatList } from "react-native-gesture-handler";
import colors from "../styles/colors";
import Button from "../components/Button";
import { Subject, of } from "rxjs";
import { switchMap, map, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import {
  ___OFFICE_HINTS_ENDPOINT___,
  ___COURSE_HINTS_ENDPOINT___
} from "../store/constants";
import Icon5 from "react-native-vector-icons/FontAwesome5";
import Shadows from "./Shadows";

export default class OfficePicker extends Component {
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

  constructor(props) {
    super(props);

    this.officeQuery = createQuerySubject("OFFICE");
    this.courseQuery = createQuerySubject("COURSE");

    this.state = {
      officeOptions: [],
      courseOptions: []
    };
  }

  componentDidMount() {
    this.officeQuerySubscription = this.officeQuery.subscribe(
      this.officeQuerySubscriber
    );
    this.courseQuerySubscription = this.courseQuery.subscribe(
      this.courseQuerySubscriber
    );
  }

  componentWillUnmount() {
    this.officeQuerySubscription && this.officeQuerySubscription.unsubscribe();
    this.courseQuerySubscription && this.courseQuerySubscription.unsubscribe();
  }

  goBack = () => {
    this.setState(prevState => ({
      status: Math.max(0, prevState.status - 1)
    }));
  };

  changeOfficeText = text => {
    this.officeQuery.next(text);
  };

  setOffice = office => {
    this.props.setOffice && this.props.setOffice(office);
  };

  changeUnCourseText = text => {
    this.courseQuery.next(text);
  };

  changeScCourseText = text => {
    this.props.setCourse && this.props.setCourse({ name: text });
  };

  setCourse = course => {
    this.props.setCourse && this.props.setCourse(course);
  };

  setYear = index => {
    this.props.setYear && this.props.setYear(index);
  };

  getContent = () => {
    const { officeOptions, courseOptions } = this.state;
    const { status, office, course, year } = this.props;

    switch (status) {
      case 0:
        return (
          <OfficeState
            value={office}
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
            value={course}
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

  renderOfficeOption = item => {
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

  renderUnCourseOption = item => {
    return (
      <Header3 color={"black"} style={{ margin: 10 }}>
        {item.name}
      </Header3>
    );
  };

  officeQuerySubscriber = {
    next: options => {
      this.setState({ officeOptions: options });
    },
    error: err => {
      console.log(err);
      this.setState({ officeOptions: [] });
    }
  };

  courseQuerySubscriber = {
    next: options => {
      this.setState({ courseOptions: options });
    },
    error: err => {
      console.log(err);
      this.setState({ courseOptions: [] });
    }
  };
}

const OfficeState = ({ value, ...props }) => {
  return (
    <Picker
      value={value.name}
      {...props}
      placeholder={"Seleziona la tua università o istituto"}
    />
  );
};

const CourseState = ({
  value,
  changeUnCourseText,
  changeScCourseText,
  isUn,
  ...props
}) => {
  if (isUn) {
    return (
      <Picker
        value={value.name}
        {...props}
        placeholder="Seleziona il tuo corso"
        onTextChange={changeUnCourseText}
      />
    );
  } else {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <OutlinedInput
          value={value.name}
          {...props}
          placeholder="Sezione (es: A)"
          onTextChange={changeScCourseText}
          containerStyle={{ width: 200 }}
          autoCapitalize="characters"
          inputStyle={{ textAlign: "center" }}
        />
      </View>
    );
  }
};

const yearBoxSize = ((Dimensions.get("window").width - 40) / 5) * (3 / 4);

const YearState = ({ value, setYear, options }) => {
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
                  ...StyleSheet.absoluteFill,
                  borderWidth: 1,
                  borderColor: colors.secondary,
                  borderRadius: 6
                }}
              />
            )}
          </Button>
        );
      }}
      keyExtractor={item => item}
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

const canOfficeContinue = office => office.id !== undefined;
const canCourseContinue = course => course.name !== undefined;
const canYearContinue = year => year !== undefined;

export const canStateContinue = ({ office, status, year, course }) => {
  switch (status) {
    case 0:
      return canOfficeContinue(office);
    case 1:
      return canCourseContinue(course);
    default:
      return canYearContinue(year);
  }
};

const createQuerySubject = type =>
  new Subject().pipe(
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
