import React from "react";
import ReactTable from "react-table";
import { css } from "react-emotion";
import {
  Button,
  FormControl,
  FormGroup,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";
import { connect } from "react-redux";

const searchBox = css`
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 15px;
  max-width: 75%;
`;

const resultsTable = css`
  height: 100%;
`;

const reactTableResults = css`
  margin-bottom: 25px;
  margin-left: 15px;
  margin-right: 15px;
  height: 75%;
`;

const columns = [
  {
    Header: "Task Age",
    accessor: "taskAge",
    width: 75
  },
  {
    Header: "Task SID",
    accessor: "taskSid",
    width: 250
  },
  {
    Header: "Workflow Name",
    accessor: "workflowName",
    width: 125
  },
  {
    Header: "Queue Target Exp",
    accessor: "taskQueueTargetExpression",
    width: 140
  },
  {
    Header: "Queue Name",
    accessor: "taskQueueName"
  },
  {
    Header: "Event Type",
    accessor: "eventType"
  },
  {
    Header: "Task Description",
    accessor: "taskDescription",
    width: 455
  },
  {
    Header: "Worker",
    accessor: "workerName"
  }
];

const mapStateToProps = state => {
  var tempUrl =
    state.flex.config.serviceBaseUrl.slice(-1) === "/"
      ? state.flex.config.serviceBaseUrl.substring(
          0,
          state.flex.config.serviceBaseUrl.length - 1
        )
      : state.flex.config.serviceBaseUrl;
  return {
    url: tempUrl.replace("https://", "")
  };
};

export class TaskEventHistoryComponent extends React.Component {
  constructor(props) {
    super(props);

    this.getEventHistoryForTask = this.getEventHistoryForTask.bind(this);
    this.convertEventRowToTableRow = this.convertEventRowToTableRow.bind(this);
    this.handleSearchTaskSid = this.handleSearchTaskSid.bind(this);
    this.handleTaskSidChange = this.handleTaskSidChange.bind(this);

    this.state = {
      taskSid: "",
      data: [],
      noDataMessage: ""
    };

    this.getEventHistoryForTask(this.state.taskSid);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getEventHistoryForTask(taskSid) {
    var newData = [];
    var newMessage = "";
    fetch(`https://${this.props.url}/getEventsForTask`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `taskSid=${taskSid}`
    })
      .then(
        response => response.json(),
        error => {
          newMessage =
            "Error calling function: Perhaps Function is not setup or serviceBaseUrl is not set correctly";
          this.setState(state => ({
            data: newData,
            noDataMessage: newMessage
          }));
        }
      )
      .then(
        response => {
          if (response.eventsize === 0) {
            newMessage = response.message;
          }
          for (var i in response.eventlist) {
            newData.push(this.convertEventRowToTableRow(response.eventlist[i]));
          }
          this.setState(state => ({
            data: newData,
            noDataMessage: newMessage
          }));
        },
        error => {
          newMessage =
            "Error calling function: Perhaps Function is not setup or serviceBaseUrl is not set correctly";
          this.setState(state => ({
            data: newData,
            noDataMessage: newMessage
          }));
        }
      );
  }

  // for readability
  convertEventRowToTableRow(taskRouterEvent) {
    var row = {
      taskAge: taskRouterEvent.eventData.task_age,
      taskSid: taskRouterEvent.eventData.task_sid,
      taskDescription: taskRouterEvent.description,
      workflowName: taskRouterEvent.eventData.workflow_name,
      taskQueueTargetExpression:
        taskRouterEvent.eventData.task_queue_target_expression,
      taskQueueName: taskRouterEvent.eventData.task_queue_name,
      workerName: taskRouterEvent.eventData.worker_name,
      workerAttributes: taskRouterEvent.eventData.worker_attributes,
      eventType: taskRouterEvent.eventType,
      eventDate: taskRouterEvent.eventDate,
      eventSource: taskRouterEvent.source,
      eventSid: taskRouterEvent.sid
    };
    return row;
  }

  handleSearchTaskSid() {
    this.getEventHistoryForTask(this.state.taskSid);
  }

  handleTaskSidChange(event) {
    this.setState({ taskSid: event.target.value });
  }

  render() {
    return (
      <div>
        <div className={searchBox}>
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
            integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
            crossorigin="anonymous"
          />
          <FormGroup>
            <ControlLabel>Search For Task SID</ControlLabel>
            <FormControl
              type="text"
              value={this.state.taskSid}
              placeholder="Enter Task SID here..."
              onChange={this.handleTaskSidChange}
            />
            <FormControl.Feedback />
            <HelpBlock>Default search period is the last 48 hours</HelpBlock>
            <Button onClick={this.handleSearchTaskSid}>Search</Button>
          </FormGroup>
        </div>
        <div className={resultsTable}>
          <link
            rel="stylesheet"
            href="https://unpkg.com/react-table@latest/react-table.css"
            crossorigin="anonymous"
          />
          <ReactTable
            className={reactTableResults}
            columns={columns}
            data={this.state.data}
            noDataText={this.state.noDataMessage}
            defaultPageSize={50}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TaskEventHistoryComponent);
