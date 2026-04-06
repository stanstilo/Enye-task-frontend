import React, { useState, useEffect } from "react";
import TablePagination from '@material-ui/core/TablePagination';
import {FaSpinner} from 'react-icons/fa';
import "./UserProfile.css";


const UserProfile = () => {

  const [data, setData] = useState({
    loading: false,
    error: null,
    result: [],
  });

  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectValue, setSelectValue] = useState("all");

  const [page, setPage] = useState(0);
  const [userPerPage, setUserPerPage] = useState(20);
 
  const indexOfLastUser = page * userPerPage
  const indexOfFirstUser = indexOfLastUser + userPerPage

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setUserPerPage(event.target.value, 20)
    setPage(0);
  };

  useEffect(() => {
    const handleLoadData = async () => {
      setData({
        ...data,
        error: null,
        result: [],
        loading: true,
      });
      setFilteredData([]);

      try {
        const request = await fetch(
          "https://reqres.in/api/users"
        );
        const response = await request.json();
        setData({
          ...data,
          loading: false,
          result: response.records.profiles,
          error: null,
        });
        setFilteredData(response.records.profiles);
      } catch (error) {
        setData({
          ...data,
          loading: false,
          result: [],
          error: error.message,
        });
        setFilteredData([]);
      }
    };
    handleLoadData();
  }, []);

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value);
    let inputValue = e.target.value;
    let filteredInput =
      inputValue.length > 0 &&
      data.result.filter(
        (item) =>
          item.FirstName.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.LastName.toLowerCase().includes(inputValue.toLowerCase())
      );
    if (inputValue === "") {
      setFilteredData(data.result);
    } else {
      setFilteredData(filteredInput);
    }
  };

  const handleSelectValue = (e) => {
    setSelectValue(e.target.value);

    let selectedValue = e.target.value;
    let filteredInput =
      selectedValue.length > 0 &&
      data.result.filter(
        (item) =>
          item.Gender.toLowerCase() === selectedValue.toLowerCase() ||
          item.PaymentMethod.toLowerCase() === selectedValue.toLowerCase()
      );

    if (e.target.value === "all") {
      setFilteredData(data.result);
    } else {
      setFilteredData(filteredInput);
    }
  };

  const handleFilterTitle = (title) => {
    const filter = [];
    data.result.forEach((item) => filter.push(item[title]));
    return [...new Set([...filter])];
  };

  return (
    <div>
    <div className="user-profile-container">
    {data.loading && (
        <div className='spinner-container'>
          <FaSpinner className="spinner"/>
        </div>
      )}
      {data.error && (
        <div>
          <h3>Error : {data.error}</h3>
        </div>
      )}
      {data.result && data.result.length > 0 && (

        <>
        <div className = 'profile-text'>
         <h2>User Profiles</h2>
         </div>
        <div className = "search-filter-container">
        <div className = 'pt-3 ml-4 input-search-container'>
         
          <input
            type="text"
            placeholder="search users by name"
            value={searchValue}
            onChange={handleSearchValue}
            className='search-input'
          />
          </div>
        {/* filter section */}
          <div className="pt-3 filter-row">
            Filter:{" "}
            <select value={selectValue} onChange={handleSelectValue}>
              <option value="all">All</option>
              <optgroup label="Gender">
                {handleFilterTitle("Gender").map((item, index) => {
                  return <option key={index} value={item}>{item}</option>;
                })}
              </optgroup>
              <optgroup label="Payment Method">
                {handleFilterTitle("PaymentMethod").map((item, index) => {
                  return <option key={index} value={item}>{item}</option>;
                })}
              </optgroup>
            </select>
          </div>
          </div>

          {/* TABLE SECTION */}
          <table className='table'>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Payment Method</th>
                <th>Credit Card Type</th>
              </tr>
            </thead>
            
            <tbody>
              {filteredData.length > 0 &&
                filteredData.slice(indexOfLastUser, indexOfFirstUser).map((record, index) => {
                  const {
                    FirstName,
                    LastName,
                    Gender,
                    Email,
                    PhoneNumber,
                    PaymentMethod,
                    CreditCardType,
                  } = record;

                  return (
                    <tr key={index}>
                      <td>{FirstName}</td>
                      <td>{LastName}</td>
                      <td>{Gender}</td>
                      <td>{Email}</td>
                      <td>{PhoneNumber}</td>
                      <td>{PaymentMethod}</td>
                      <td>{CreditCardType}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

    <TablePagination
      count={filteredData.length}
      page={page}
      onChangePage={handleChangePage}
      rowsPerPage={userPerPage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      backIconButtonProps={{
        "aria-label": "Previous Page",
        style: {color: page===0?"#b5b8c4":"#7A6CF2" },
        autoid: "pagination-button-next-collector",
      }}
      nextIconButtonProps={{
        "aria-label": "Next Page",
        style: {color: page >= Math.ceil(filteredData.length /  userPerPage) - 1 ? "#b5b8c4" : "#7A6CF2"},
        autoid: "pagination-button-previous-collector",
      }}
      rowsPerPageOptions={[20, 40,  60, 80, 100]}
     />
      </>
      )}
    </div>
    </div>
  );
}

export default UserProfile
