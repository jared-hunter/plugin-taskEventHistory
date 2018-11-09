import React from "react";
import ReactTable from "react-table";
import {
  Button,
  FormControl,
  FormGroup,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";
import { connect } from "react-redux";
import "react-table/react-table.css";
import "./TaskEventHistoryComponent.css";

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
  return {
    url:
      state.flex.config.serviceBaseUrl.slice(-1) === "/"
        ? state.flex.config.serviceBaseUrl.substring(
            0,
            state.flex.config.serviceBaseUrl.length - 1
          )
        : state.flex.config.serviceBaseUrl
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
    this.getEventHistoryForTask(
      this.props.url,
      this.state.taskSid
      //"WTc04533277fc5b8d0d9dd265d936f5ed9"
    );
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getEventHistoryForTask(url, taskSid) {
    console.log("IN GETEVENTHISTORY");
    var newData = [];
    var newMessage = "";
    fetch(`${url}/getEventsForTask`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `taskSid=${taskSid}`
    })
      .then(response => response.json())
      .then(response => {
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
      });
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
    this.getEventHistoryForTask(this.props.url, this.state.taskSid);
  }

  handleTaskSidChange(event) {
    this.setState({ taskSid: event.target.value });
  }

  render() {
    return (
      <div>
        <form class="searchBox">
          <link
            rel="stylesheet"
            href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
            integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
            crossorigin="anonymous"
          />
          <FormGroup controlId="formBasicText">
            <ControlLabel>Search For Task SID</ControlLabel>
            <FormControl
              type="text"
              value={this.state.taskSid}
              placeholder="Enter Task SID here..."
              onChange={this.handleTaskSidChange}
            />
            <FormControl.Feedback />
            <HelpBlock>Default search period is last 48 hours</HelpBlock>
            <Button onClick={this.handleSearchTaskSid}>Search</Button>
          </FormGroup>
        </form>
        <div class="resultsTable">
          <ReactTable
            columns={columns}
            data={this.state.data}
            noDataText={this.state.noDataMessage}
            className="-striped -highlight"
            defaultPageSize={50}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(TaskEventHistoryComponent);
