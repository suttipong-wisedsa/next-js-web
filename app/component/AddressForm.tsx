import Address from "./Autocomplete";

export default function AddressForm(props) {
  const {
    name,
    setName,
    phone,
    setPhone,
    setError,
    houseNumber,
    setHouseNumber,
    subdistrict,
    setSubDistrict,
    district,
    setDistrict,
    province,
    setProvince,
    zipcode,
    setZipcode,
    fullAddress,
    setFullAddress,
    onSelect,
    setForOthers,
    forOthers,
    senderName,
    setSenderName,
    senderPhone,
    setSenderPhone,
  } = props;

  return (
    <div>
      <Address
        setError={setError}
        houseNumber={houseNumber}
        setHouseNumber={setHouseNumber}
        subdistrict={subdistrict}
        setSubDistrict={setSubDistrict}
        district={district}
        setDistrict={setDistrict}
        province={province}
        setProvince={setProvince}
        zipcode={zipcode}
        setZipcode={setZipcode}
        fullAddress={fullAddress}
        setFullAddress={setFullAddress}
        onSelect={onSelect}
      />
    </div>
  );
}
