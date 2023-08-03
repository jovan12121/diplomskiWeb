import { useEffect, useState } from "react";
import { GetSellers, VerifySeller } from "../../services/userService";
import { toast } from "react-toastify";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, TableSortLabel, Paper } from "@mui/material";
import Seller from "../model/Seller";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CancelPresentationRoundedIcon from '@mui/icons-material/CancelPresentationRounded';
function Verification() {
  const [sellers, setSellers] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    const getSellers = async () => {
      const resp = await GetSellers();
      const sellerData = resp.data.map((seller) => new Seller(seller));
      setSellers(sellerData);
    };
    getSellers();
  }, []);

  async function verifySeller(username, v) {
    const resp = await VerifySeller(username, v);
    if (resp.data === true) {
      toast.success("Successful verification!");
      const updatedSellers = Array.from(sellers).map((seller) => {
        if (seller.username === username) {
          return { ...seller, verified: v };
        }
        return seller;
      });
      setSellers(updatedSellers);
    } else {
      toast.error("Error");
    }
  }

  const sortedSellers = [...sellers].sort((seller1, seller2) => {
    if (!sortConfig) {
      return 0;
    }

    const { column, direction } = sortConfig;

    if (seller1[column] < seller2[column]) {
      return direction === "asc" ? -1 : 1;
    }
    if (seller1[column] > seller2[column]) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  function getDate(birthday) {
    const date1 = new Date(birthday);
    const year = date1.getFullYear();
    const month = date1.getMonth() + 1;
    const day = date1.getDate();
    return `${day}/${month}/${year}`;
  }

  function handleThClick(column) {
    let direction = "asc";
    if (sortConfig && sortConfig.column === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ column, direction });
  }

  return (
    <Container>
      <TableContainer>
        <Paper>
          <Table className="mt-1" >
            <TableHead>
              <TableRow>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig?.column === "username"}
                    direction={sortConfig?.column === "username" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("username")}
                  >
                    Username
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig?.column === "name"}
                    direction={sortConfig?.column === "name" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("name")}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig?.column === "lastname"}
                    direction={sortConfig?.column === "lastname" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("lastname")}
                  >
                    Lastname
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig?.column === "email"}
                    direction={sortConfig?.column === "email" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("email")}
                  >
                    Email
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig?.column === "birthday"}
                    direction={sortConfig?.column === "birthday" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("birthday")}
                  >
                    Birthday
                  </TableSortLabel>
                </TableCell>
                <TableCell style={{ textAlign: "center" }}>
                  <TableSortLabel
                    active={sortConfig?.column === "address"}
                    direction={sortConfig?.column === "address" ? sortConfig.direction : "asc"}
                    onClick={() => handleThClick("address")}
                  >
                    Address
                  </TableSortLabel>
                </TableCell >
                <TableCell style={{ textAlign: "center" }}>Picture</TableCell>
                <TableCell style={{ textAlign: "center" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(sortedSellers).map((seller) => (
                <TableRow key={seller.username}>
                  <TableCell style={{ textAlign: "center" }}>{seller.username}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{seller.name}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{seller.lastname}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{seller.email}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{getDate(seller.birthday)}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>{seller.address}</TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <img width="40" height="40" src={`data:image/png;base64,${seller.picture}`} alt="" />
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    {seller.verified != null ? (
                      <Button variant="outlined" disabled startIcon={seller.verified ?<CheckRoundedIcon/>:<CancelPresentationRoundedIcon/>}>
                        {seller.verified ? "Verified" : "Denied"}
                      </Button>
                    ) : (
                      <>
                        <Button variant="contained" color="success" onClick={() => verifySeller(seller.username, true)} startIcon={<CheckRoundedIcon/>}>
                          Verify
                        </Button>
                        <Button variant="contained" color="error" onClick={() => verifySeller(seller.username, false)} className="mx-3" startIcon={<CancelPresentationRoundedIcon/>} >
                          Deny
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </TableContainer>
    </Container>
  );
}

export default Verification;
